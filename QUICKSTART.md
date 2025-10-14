# Quick Start Guide

## 🚀 Running the Application

### Start the Development Server

```bash
cd spec-kit-demo-v2
npx nx serve shell
```

This will start:
- **Shell app** (host) at http://localhost:4200
- **New Instructions UI** (remote) at http://localhost:4201

### What You'll See

1. **Home Page** - A welcome page with feature cards
2. **Navigation Bar** - Responsive navbar with menu and user options
3. **New Instructions UI** - Click "Explore" on the New Instructions card or use the navigation menu

### Key Features to Try

#### Navigation
- Click on "New Instructions" in the navbar
- Try the mobile menu (resize your browser)
- Click the user icon for login/profile options

#### Microfrontend Demo
- Navigate to "New Instructions" to see the remote app load
- Open DevTools Network tab to see the remote bundle loading

#### Material UI Components
- Explore the responsive design
- Try the themed buttons and cards
- Test the login form at `/login`

## 🏗️ Building for Production

Build both applications:
```bash
npx nx run-many -t build
```

Build outputs will be in:
- `dist/apps/shell`
- `dist/apps/newInstructionsUi`

## 📊 View the Project Graph

See how your apps are connected:
```bash
npx nx graph
```

## 🧪 Testing

Run tests:
```bash
npx nx test shell
npx nx test newInstructionsUi
```

## 🔍 Linting

Lint your code:
```bash
npx nx lint shell
npx nx lint newInstructionsUi
```

## 🛠️ Development Tips

### Hot Reload
Both shell and remote apps support hot module replacement (HMR). Changes will reflect immediately.

### Debugging Module Federation
1. Open Chrome DevTools
2. Go to Network tab
3. Navigate to New Instructions UI
4. You'll see `remoteEntry.js` being loaded

### Adding New Routes

In `apps/shell/src/app/app.tsx`:
```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/new-instructions-ui" element={<NewInstructionsUi />} />
  {/* Add your route here */}
</Routes>
```

### Creating New Components

```bash
cd apps/shell/src/components
touch MyComponent.tsx
```

Then import in your app:
```tsx
import { MyComponent } from '../components/MyComponent';
```

## 📝 Customization

### Change Theme Colors

Edit `apps/shell/src/app/app.tsx`:
```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
  },
});
```

### Add New Remote Apps

```bash
npx nx g @nx/react:remote apps/my-new-remote --host=shell
```

## 🐛 Troubleshooting

### Port Already in Use
If port 4200 is busy:
```bash
npx nx serve shell --port=4300
```

### Build Errors
Clear the cache and rebuild:
```bash
npx nx reset
npx nx build shell
```

### Type Errors
Ensure TypeScript is properly configured:
```bash
npx nx lint shell --fix
```

## 📚 Next Steps

1. Explore the `apps/shell/src/components` directory
2. Modify the `Home.tsx` component to add your content
3. Create new remote applications
4. Add state management (Redux, Context API)
5. Integrate with backend APIs
6. Add authentication logic

## 🆘 Need Help?

- Check the main [README.md](./README.md)
- Visit [NX Documentation](https://nx.dev)
- See [Module Federation docs](https://webpack.js.org/concepts/module-federation/)

---

Happy coding! 🎉
