# Impact Analyzer

An AI-powered system impact analysis tool for enterprise change management. This application helps organizations understand the potential impacts of system changes by analyzing architecture, server configurations, diagrams, and change requests.

## 🚀 Features

### Core Functionality
- **System Architecture Analysis**: Support for Client-Server, Monolithic, and Microservices architectures
- **Server Configuration Management**: Comprehensive server details including deployment platforms, OS, RAM, storage, and server types
- **Diagram Upload & Analysis**: Support for PDF diagrams and Mermaid code diagrams
- **Change Request Processing**: File upload and text-based change request handling
- **AI-Powered Impact Analysis**: Intelligent analysis of potential system impacts

### AI Integration
- **Multi-Model Support**: Configurable AI model integration (OpenAI GPT-4/3.5, Google Gemini Pro/Pro Vision)
- **Caching System**: Intelligent result caching for improved performance
- **Retry Logic**: Robust error handling with configurable retry mechanisms
- **Real-time Analysis**: Configurable real-time analysis capabilities

### Premium UI/UX
- **Minimal Design**: Clean, professional interface with gray-based color scheme
- **Responsive Layout**: Works seamlessly across desktop and mobile devices
- **Real-time Feedback**: Loading states and progress indicators
- **Export Capabilities**: Professional report export functionality

## 🏗️ Architecture

### Project Structure
```
impact-analyzer/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ArchitectureDropdown.tsx
│   ├── ServerDetailsForm.tsx
│   ├── DiagramUpload.tsx
│   ├── ChangeRequestUpload.tsx
│   └── ImpactAnalysis.tsx
├── config/               # Configuration files
│   └── ai-config.ts      # AI model and system configuration
├── lib/                  # Utility libraries
│   ├── ai-analysis.ts    # AI analysis service
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

### Code Architecture

#### 1. Configuration Management (`config/ai-config.ts`)
- **Centralized Configuration**: All AI models, system settings, and UI preferences in one file
- **ConfigManager Class**: Singleton pattern for configuration management
- **Extensible Design**: Easy to add new AI providers and configurations
- **Local Storage**: Persistent configuration storage

#### 2. AI Analysis Service (`lib/ai-analysis.ts`)
- **Provider Pattern**: Extensible AI provider system
- **Interface-based Design**: Clean separation of concerns
- **Caching Layer**: Intelligent result caching
- **Error Handling**: Robust retry and timeout mechanisms

#### 3. Component Architecture
- **Modular Design**: Each component handles specific functionality
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Reusable UI**: Shared UI components for consistency
- **State Management**: React hooks for local state management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Quick Start
   ```bash
# Clone the repository
git clone <repository-url>
cd impact-analyzer

# Install dependencies
   npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Environment Configuration

#### 1. Create Environment File
Copy the example environment file and configure your API keys:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the file with your actual API keys
nano .env.local  # or use your preferred editor
```

#### 2. Configure API Keys
Edit `.env.local` and add your API keys:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API Configuration  
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_NAME=Impact Analyzer
NEXT_PUBLIC_APP_VERSION=1.0.0

# Development Configuration
NODE_ENV=development
```

#### 3. API Key Setup
- **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

> **Note**: The `.env.local` file is automatically ignored by Git for security. Never commit API keys to version control.

## ⚙️ Configuration

### AI Model Configuration
The application uses a centralized configuration system in `config/ai-config.ts`. You can:

1. **Enable/Disable Models**: Set `enabled: true/false` for each model
2. **Configure API Keys**: Add your API keys to the model configuration
3. **Set Default Model**: Change `defaultModel` to your preferred AI model
4. **Adjust Parameters**: Modify `maxTokens`, `temperature`, `timeout` as needed

### Example Configuration
```typescript
// Enable OpenAI GPT-4
{
  id: 'gpt-4',
  name: 'GPT-4',
  provider: 'openai',
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY,
  maxTokens: 4000,
  temperature: 0.3,
  timeout: 30000,
  enabled: true
}

// Enable Google Gemini Pro
{
  id: 'gemini-pro',
  name: 'Gemini Pro',
  provider: 'gemini',
  model: 'gemini-pro',
  apiKey: 'your_gemini_api_key',
  maxTokens: 4000,
  temperature: 0.3,
  timeout: 30000,
  enabled: true
}
```

### System Configuration
```typescript
system: {
  maxFileSize: 10,           // Maximum file size in MB
  allowedFileTypes: ['.pdf', '.txt', '.doc', '.docx'],
  maxDiagrams: 20,           // Maximum number of diagrams
  maxServers: 10,            // Maximum number of servers
  enableAutoSave: true,      // Auto-save functionality
  autoSaveInterval: 30       // Auto-save interval in seconds
}
```

## 🔧 Usage

### 1. System Architecture Setup
- Select your system architecture (Client-Server, Monolithic, Microservices)
- The AI will analyze how changes affect different architecture patterns

### 2. Server Configuration
- Add server details including:
  - **Deployment Platform**: AWS, Azure, Alibaba Cloud, GCP, On-Premise
  - **Server Type**: Physical, Virtual, Container, Serverless
  - **Specifications**: RAM, Storage, Operating System
  - **Custom Options**: Support for custom RAM and storage specifications

### 3. Diagram Upload
- **PDF Diagrams**: Upload system architecture diagrams
- **Mermaid Diagrams**: Add Mermaid code for system flow diagrams
- **Analysis**: AI analyzes diagrams for system dependencies and relationships

### 4. Change Request
- **File Upload**: Upload change request documents (PDF, TXT, DOC, DOCX)
- **Text Input**: Enter change request details directly
- **Guidelines**: Follow provided guidelines for comprehensive change requests

### 5. AI Analysis
- Click "Analyze Impact" to trigger AI analysis
- Review comprehensive impact report including:
  - **Risk Assessment**: Overall risk level and detailed component impacts
  - **Recommendations**: Technical, operational, security, and performance recommendations
  - **Timeline Estimation**: Effort and timeline estimates
  - **Dependency Mapping**: System dependencies and relationships

## 🔌 AI Model Integration

### Adding New AI Providers
1. **Create Provider Class**: Implement the `AIProvider` interface
2. **Register Provider**: Add to the `initializeProviders()` method
3. **Update Configuration**: Add model configuration to `ai-config.ts`

### Example Provider Implementation
```typescript
export class OpenAIProvider implements AIProvider {
  async analyze(request: ImpactAnalysisRequest, model: AIModelConfig): Promise<ImpactAnalysisResult> {
    // Implement OpenAI API integration
    const response = await openai.chat.completions.create({
      model: model.model,
      messages: [
        {
          role: "system",
          content: "You are an expert system architect analyzing change impacts..."
        },
        {
          role: "user", 
          content: JSON.stringify(request)
        }
      ],
      max_tokens: model.maxTokens,
      temperature: model.temperature
    });
    
    // Parse and return results
    return this.parseResponse(response);
  }
}
```

### Supported AI Providers
- **OpenAI**: GPT-4, GPT-3.5 Turbo
- **Google Gemini**: Gemini Pro, Gemini Pro Vision
- **Custom**: Mock AI for development/testing

## 🎨 Customization

### UI Customization
- **Theme**: Light, dark, or auto theme selection
- **Colors**: Customizable primary and accent colors
- **Animations**: Enable/disable UI animations
- **Advanced Options**: Show/hide advanced configuration options

### System Customization
- **File Limits**: Adjust maximum file sizes and types
- **Component Limits**: Modify maximum diagrams and servers
- **Auto-save**: Configure auto-save behavior
- **Caching**: Adjust cache settings for performance

## 🚀 Deployment

### Production Build
   ```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Set the following environment variables for production:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
OPENAI_API_KEY=your_production_openai_key
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Setup
   ```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### Code Style
- **TypeScript**: Full TypeScript support required
- **ESLint**: Follow ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Component Structure**: Follow established component patterns

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
1. **AI Analysis Fails**: Check API keys and model configuration
2. **File Upload Issues**: Verify file size and type restrictions
3. **Performance Issues**: Adjust caching and timeout settings

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🔮 Roadmap

### Planned Features
- **Real-time Collaboration**: Multi-user editing and analysis
- **Advanced AI Models**: Integration with more AI providers
- **Custom Analysis Rules**: User-defined analysis criteria
- **Integration APIs**: REST API for external integrations
- **Advanced Reporting**: Enhanced export and reporting features

### Performance Improvements
- **Server-side Rendering**: Improved SEO and performance
- **Progressive Web App**: Offline capabilities and mobile app features
- **Database Integration**: Persistent storage for large datasets
- **Caching Optimization**: Advanced caching strategies

---

**Impact Analyzer** - Making system change management intelligent and efficient.
