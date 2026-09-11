package com.agenda.app

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONArray

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private var pendingActivityId: String? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        pendingActivityId = intent.getStringExtra("activity_id")
        webView = findViewById(R.id.agendaWebView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
        }
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                pendingActivityId?.let { id ->
                    view?.evaluateJavascript(
                        "window.__nativeActivityId = ${org.json.JSONObject.quote(id)}; if (typeof loadActivityFromURL === 'function') loadActivityFromURL(); if (typeof updatePage === 'function') updatePage();",
                        null
                    )
                    pendingActivityId = null
                }
            }
        }
        webView.webChromeClient = WebChromeClient()
        webView.addJavascriptInterface(AgendaBridge(), "AndroidAgenda")

        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onNewIntent(intent: android.content.Intent?) {
        super.onNewIntent(intent)
        intent ?: return
        pendingActivityId = intent.getStringExtra("activity_id")
        pendingActivityId?.let { id ->
            webView.evaluateJavascript(
                "window.__nativeActivityId = ${org.json.JSONObject.quote(id)}; if (typeof loadActivityFromURL === 'function') loadActivityFromURL(); if (typeof updatePage === 'function') updatePage();",
                null
            )
            pendingActivityId = null
        }
    }

    inner class AgendaBridge {
        @JavascriptInterface
        fun syncTasks(json: String) {
            try {
                val tasks = JSONArray(json)
                getSharedPreferences(AgendaWidgetProvider.PREFS_NAME, MODE_PRIVATE)
                    .edit()
                    .putString(AgendaWidgetProvider.TASKS_JSON_KEY, tasks.toString())
                    .apply()
                AgendaWidgetProvider.updateAll(this@MainActivity)
            } catch (_: Exception) {
                // Ignore malformed widget sync data; the web app remains usable.
            }
        }
    }
}
