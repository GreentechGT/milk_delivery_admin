# 🚀 Milk Delivery Admin Panel (React Native / Expo)

Welcome to the **Admin Panel** repository for the Milk Delivery system! This is a React Native application built with [Expo](https://expo.dev/) that allows administrators to manage deliveries, vendors, and orders seamlessly.

*Note: The UI of the application is fully functional and can currently be run independently without requiring a backend connection.*

---

## 📋 Prerequisites

Ensure your development environment meets the following requirements:

*   **[Node.js](https://nodejs.org/en/)** (LTS version recommended: v18+)
*   **npm** (bundled with Node.js) or **Yarn**
*   **Expo CLI**: Usually ships with npx, but recommended to have installed globally (`npm install -g expo-cli`)
*   **Development Tools**:
    *   **Android**: [Android Studio](https://developer.android.com/studio) installed with a configured Android Virtual Device (AVD).

---

## ⚙️ Local Development Setup

Follow these steps to get the app running on your local machine.

### 1. Clone the Project
```bash
git clone <your-repository-url>
```

### 2. Install Dependencies
Navigate into the frontend admin directory and install the required Node modules:
```bash
cd milk_delivery_admin
npm install
```

### 3. Run the Application
Start the native Android build natively. This will compile the app and launch it on your emulator or connected physical device:
```bash
npx expo run:android
```

Once the Metro bundler is running in your terminal, you can press:
*   `a` to launch your Android Emulator.
*   `w` to load the app in your web browser. 
*   `m` to toggle the developer menu.

---

## 📂 Project Structure Overview

```text
milk_delivery_admin/
├── src/
│   ├── components/      # Reusable UI components (Buttons, Cards, Modals)
│   ├── context/         # React Context for global state (e.g., AuthContext)
│   ├── navigation/      # React Navigation setup (Stack, Drawer, Tabs)
│   ├── screens/         # Main application screens (Dashboard, Support, Orders)
│   └── services/        # API calls (Setup for future backend connection)
├── assets/              # Static files (images, icons, fonts)
├── app.json             # Expo configuration rules
├── App.js               # Application entry point
└── package.json         # Project dependencies and scripts
```

---

## 🛠️ Troubleshooting

- **Metro Bundler Caching Issues:** 
  If your latest changes aren't reflecting, start the Expo server with a cleared cache:
  ```bash
  npx expo start -c
  ```