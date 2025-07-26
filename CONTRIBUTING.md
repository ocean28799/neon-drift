# Contributing to Neon Drift

Thank you for your interest in contributing to Neon Drift! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- A code editor (VS Code recommended)

### Setting Up the Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/neon-drift.git
   cd neon-drift
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open** [http://localhost:3000](http://localhost:3000) to see the game

## 🎯 How to Contribute

### Areas We Welcome Contributions

1. **🎮 Game Features**
   - New power-ups and abilities
   - Additional game modes
   - Enhanced visual effects
   - Performance optimizations

2. **📚 Educational Content**
   - New vocabulary chapters
   - Different languages
   - Question types and formats
   - Learning analytics

3. **🎨 Visual Improvements**
   - UI/UX enhancements
   - Animation improvements
   - New particle effects
   - Mobile responsiveness

4. **🔊 Audio Features**
   - Sound effects
   - Background music
   - Audio accessibility
   - Voice narration

5. **🧪 Testing & Quality**
   - Unit tests
   - Integration tests
   - Bug fixes
   - Code quality improvements

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit with a descriptive message**:
   ```bash
   git commit -m "feat: add new power-up system"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### TypeScript/React Guidelines
- Use functional components with hooks
- Prefer TypeScript interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow the existing file structure

### Code Style
- Use Prettier for formatting (automatic in VS Code)
- Follow ESLint rules
- Use Tailwind CSS classes for styling
- Keep components focused and reusable

### Git Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` code style changes (formatting, etc.)
- `refactor:` code refactoring
- `test:` adding or modifying tests
- `chore:` maintenance tasks

Examples:
```
feat: add mystery box component with random rewards
fix: resolve collision detection bug with shields
docs: update README with new installation steps
style: improve mobile responsive design
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # App layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── NeonDriftGame.tsx  # Main game component
│   ├── LanguageLearning.tsx # Vocabulary system
│   ├── GameHUD.tsx        # User interface
│   └── ...                # Other game components
├── utils/                 # Utility functions
│   └── soundEngine.ts     # Audio management
└── vocabulary/            # Learning content
    ├── chapter01-basic-everyday.ts
    └── ...                # Vocabulary chapters
```

## 🎮 Game Architecture

### Core Systems
1. **Game Loop**: Main game state and rendering
2. **Physics**: Collision detection and movement
3. **Learning System**: Vocabulary questions and progress
4. **Audio Engine**: Sound effects and music
5. **Particle System**: Visual effects
6. **UI System**: HUD and menus

### Key Components
- `NeonDriftGame`: Central game logic
- `LanguageLearning`: Educational features
- `ParticleSystem`: Visual effects
- `SoundEngine`: Audio management

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write unit tests for utility functions
- Add integration tests for game components
- Test educational features thoroughly
- Include accessibility tests

## 📚 Adding Vocabulary Content

### Creating New Chapters
1. Create a new file in `src/vocabulary/`
2. Follow the existing format:
   ```typescript
   export const chapterXXWords = [
     {
       id: 'unique-id',
       english: 'English word',
       translation: 'Translation',
       pronunciation: 'Pronunciation guide',
       example: 'Example sentence',
       difficulty: 1 // 1-5 scale
     },
     // ... more words
   ];
   ```
3. Update the main game component to include your chapter
4. Add appropriate difficulty progression

### Content Guidelines
- Ensure translations are accurate
- Include diverse vocabulary
- Add pronunciation guides
- Provide contextual examples
- Consider cultural sensitivity

## 🐛 Reporting Issues

### Bug Reports
Please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots or videos if applicable

### Feature Requests
Please include:
- Clear description of the feature
- Use case or problem it solves
- Proposed implementation (if any)
- Potential impact on existing features

## 📜 License

By contributing to Neon Drift, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers.

## 💬 Getting Help

- 📧 **Email**: Open an issue for questions
- 💬 **Discord**: [Join our Discord](# Add Discord link when available)
- 📖 **Documentation**: Check the README and code comments

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special in-game credits for major features

Thank you for contributing to Neon Drift! 🌟
