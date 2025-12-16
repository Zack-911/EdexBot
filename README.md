# ForgeScript TypeScript Template

A modern TypeScript template for creating Discord bots with ForgeScript, featuring a clean project structure and development tools.

## ✨ Features

- **TypeScript Support**: Full TypeScript support with strict type checking
- **Modern ES Modules**: Built with ES modules for better code organization
- **Pre-configured Build System**: Ready-to-use build scripts
- **Developer Tools**: Includes useful developer commands
- **SQLite Database**: Integrated with ForgeDB for data persistence
- **Canvas Support**: Includes ForgeCanvas for image manipulation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: latest LTS version)
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/forge-typescript-template.git
   cd forge-typescript-template
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your bot token:
   ```env
   TOKEN=your_discord_bot_token_here
   ```

### Development

- Build the project:
  ```bash
  npm run build
  # or
  yarn build
  ```

- Start the bot:
  ```bash
  npm start
  # or
  yarn start
  ```

- Start the bot in development mode:
```bash
npm run dev
# or
yarn dev
```

## 🏗️ Project Structure

```
├── src/
│   ├── commands/         # Text commands
│   ├── slash/            # Slash commands
│   └── index.ts          # Main bot entry point
├── database/             # Database files
├── dist/                 # Compiled JavaScript
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## 📝 Available Scripts

- `npm run build` or `yarn build`: Compiles TypeScript to JavaScript
- `npm start` or `yarn start`: Builds and runs the bot
- `npm run dev` or `yarn dev`: Builds and runs the bot in development mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Support

For support, please open an issue on the GitHub repository.
