# Agenda — Android App + Home-Screen Widget

This project wraps the existing Agenda HTML/CSS/JavaScript app in a native Android app and adds a real Android home-screen widget.

## What the widget does

- Shows today's unfinished activities on the Android home screen.
- Shows up to 4 activities, sorted by start time.
- Shows `+N more` when there are more than 4.
- Tapping the widget opens Agenda.
- Tapping an individual activity opens that activity directly.
- The widget refreshes when activities are saved in the app and also has a periodic Android update interval.

## Important

The Android app has its own WebView storage. Activities created in the browser version on GitHub Pages are not automatically copied into the Android app. Create/import your activities in the Android app, or add a future cloud sync layer if you want the same data on multiple devices.

## Open the project

1. Install Android Studio.
2. Open this folder (`AgendaAndroidWidget`) in Android Studio.
3. Let Gradle sync and install any missing Android SDK components it requests.
4. Run the app on an Android phone or emulator.
5. On the phone, long-press the home screen → Widgets → Agenda → add the widget.

## Build an APK

For testing/sharing:

- Build → Build Bundle(s) / APK(s) → Build APK(s)
- The debug APK will be under `app/build/outputs/apk/debug/`.

For a release APK:

- Build → Generate Signed Bundle / APK
- Choose APK.
- Create a release keystore and keep it backed up securely.
- Build the signed release APK.

## Publish on Google Play

For Google Play, create a signed Android App Bundle (AAB) instead of distributing the APK directly. Google Play uses app bundles to generate device-specific APKs.

The project currently targets Android 16 / API 36, which is the target level required for new Google Play apps as of August 31, 2026.

## Package name

`com.agenda.app`

Change it before publishing if you want a unique package/application ID.
