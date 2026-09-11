package com.agenda.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.view.View
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AgendaWidgetProvider : AppWidgetProvider() {
    companion object {
        const val PREFS_NAME = "agenda_widget_prefs"
        const val TASKS_JSON_KEY = "tasks_json"

        private val ROW_IDS = intArrayOf(
            R.id.widgetRow1,
            R.id.widgetRow2,
            R.id.widgetRow3,
            R.id.widgetRow4
        )

        fun updateAll(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val component = ComponentName(context, AgendaWidgetProvider::class.java)
            val ids = manager.getAppWidgetIds(component)
            if (ids.isNotEmpty()) update(context, manager, ids)
        }

        private fun update(context: Context, manager: AppWidgetManager, ids: IntArray) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val json = prefs.getString(TASKS_JSON_KEY, "[]") ?: "[]"
            val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val todayTasks = mutableListOf<JSONObject>()

            try {
                val array = JSONArray(json)
                for (i in 0 until array.length()) {
                    val task = array.optJSONObject(i) ?: continue
                    if (task.optString("date") == today && !task.optBoolean("completed", false)) {
                        todayTasks.add(task)
                    }
                }
            } catch (_: Exception) { }

            todayTasks.sortBy { it.optString("start") }

            ids.forEach { id ->
                val views = RemoteViews(context.packageName, R.layout.widget_agenda)
                views.setTextViewText(R.id.widgetTitle, "AGENDA")
                views.setTextViewText(R.id.widgetDate, "TODAY")
                views.setTextColor(R.id.widgetTitle, Color.rgb(23, 25, 28))
                views.setTextColor(R.id.widgetDate, Color.rgb(107, 114, 128))

                val openIntent = Intent(context, MainActivity::class.java)
                val openPending = PendingIntent.getActivity(
                    context,
                    id,
                    openIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                views.setOnClickPendingIntent(R.id.widgetRoot, openPending)

                views.setViewVisibility(R.id.widgetEmpty, if (todayTasks.isEmpty()) View.VISIBLE else View.GONE)
                views.setTextViewText(R.id.widgetEmpty, "No activities today")

                ROW_IDS.forEach { rowId -> views.setViewVisibility(rowId, View.GONE) }
                views.setViewVisibility(R.id.widgetMore, View.GONE)

                val shown = minOf(todayTasks.size, ROW_IDS.size)
                for (i in 0 until shown) {
                    val task = todayTasks[i]
                    val title = task.optString("title", "Activity")
                    val start = task.optString("start", "")
                    val end = task.optString("end", "")
                    val text = if (start.isNotBlank() && end.isNotBlank()) "$start–$end  $title" else title
                    val rowId = ROW_IDS[i]
                    views.setTextViewText(rowId, text)
                    views.setViewVisibility(rowId, View.VISIBLE)

                    val taskIntent = Intent(context, MainActivity::class.java).apply {
                        putExtra("activity_id", task.optString("id"))
                    }
                    val taskPending = PendingIntent.getActivity(
                        context,
                        (id * 10) + i + 1,
                        taskIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(rowId, taskPending)
                }

                if (todayTasks.size > shown) {
                    views.setTextViewText(R.id.widgetMore, "+${todayTasks.size - shown} more")
                    views.setViewVisibility(R.id.widgetMore, View.VISIBLE)
                }

                manager.updateAppWidget(id, views)
            }
        }
    }

    override fun onUpdate(context: Context, manager: AppWidgetManager, ids: IntArray) {
        update(context, manager, ids)
    }

    override fun onEnabled(context: Context) {
        updateAll(context)
    }
}
