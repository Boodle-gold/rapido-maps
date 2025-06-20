# 🗺️ Google Maps Directions App

A beautiful, modern web application that provides Google Maps directions between two coordinate points with a stunning liquid glass aesthetic UI.

## ✨ Features

- **Coordinate-based Directions**: Enter latitude and longitude coordinates for start and end points
- **Interactive Google Maps**: Real-time map display with custom dark styling
- **Step-by-step Directions**: Detailed turn-by-turn navigation instructions
- **Liquid Glass Aesthetic**: Modern glassmorphism design with blur effects and gradients
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Elegant transitions and hover effects
- **Error Handling**: User-friendly error messages and validation

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Google Maps API key

### Installation

1. **Clone or download this project**
   ```bash
   git clone <repository-url>
   cd google-maps-directions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your Google Maps API key**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Directions API
   - Create credentials (API key)
   - Copy the API key

4. **Create environment file**
   ```bash
   cp env.example .env
   ```
   
   Then edit `.env` and replace `your_google_maps_api_key_here` with your actual API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   
   The app will open at `http://localhost:3000`

## 📱 How to Use

1. **Enter Start Coordinates**: Input the latitude and longitude of your starting point
2. **Enter End Coordinates**: Input the latitude and longitude of your destination
3. **Get Directions**: Click the "Get Directions" button
4. **View Results**: 
   - The map will display the route with markers
   - Step-by-step directions will appear below the map
5. **Clear**: Use the "Clear" button to reset and start over

## 🎨 Design Features

- **Glassmorphism**: Semi-transparent glass-like panels with backdrop blur
- **Gradient Backgrounds**: Beautiful purple-blue gradient with animated overlays
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Dark Map Theme**: Custom styled Google Maps for better visual integration
- **Responsive Layout**: Adapts to different screen sizes seamlessly

## 🛠️ Technical Stack

- **React 18**: Modern React with hooks and functional components
- **Google Maps JavaScript API**: For map display and directions
- **CSS3**: Advanced styling with glassmorphism effects
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
google-maps-directions/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Styling with liquid glass aesthetic
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies and scripts
├── env.example         # Environment variables template
└── README.md          # This file
```

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `src/App.css` to customize the color scheme:

```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Glass panels */
background: rgba(255, 255, 255, 0.1);
```

### Map Styling
Modify the map styles array in `src/App.js` to change the map appearance.

### Adding Features
The modular React component structure makes it easy to add new features like:
- Multiple waypoints
- Different travel modes (walking, cycling, transit)
- Route alternatives
- Distance and time calculations

## 🚨 Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in the `.env` file
- Verify that both Maps JavaScript API and Directions API are enabled
- Check that billing is enabled for your Google Cloud project

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 14+)

### Map Not Loading
- Check browser console for JavaScript errors
- Verify internet connection
- Ensure the Google Maps API is accessible from your location

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Enjoy your journey with beautiful directions! 🗺️✨** 