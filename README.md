# IBM Demo React.js Package

A React.js application created as part of the IBM demo project.

## Features

- React 18 with modern hooks
- Webpack configuration for development and production
- Hot reload development server
- ES6+ JavaScript support with Babel
- CSS loading and styling
- Production build optimization

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/niit-ibm/Ibm-demo-sdp.git
   cd Ibm-demo-sdp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Production Build

Create a production build:
```bash
npm run build
```

The production files will be generated in the `dist/` directory.

## Project Structure

```
Ibm-demo-sdp/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main App component
│   ├── App.css             # App styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── webpack.config.js       # Webpack configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Technologies Used

- React 18
- Webpack 5
- Babel
- CSS Loader
- HTML Webpack Plugin

## License

ISC