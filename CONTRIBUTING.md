# Contributing to Easy11

Thank you for your interest in contributing to Easy11 Commerce Intelligence Platform! This document provides guidelines for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/easy11.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies and set up the development environment

## Development Setup

See [README.md](./README.md) for detailed setup instructions.

## Code Style

### TypeScript/JavaScript

- Use ESLint and Prettier configurations
- Follow the existing code style
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

```typescript
/**
 * Calculates the total revenue for a given time period
 * @param startDate Start of the period
 * @param endDate End of the period
 * @returns Total revenue
 */
async function calculateRevenue(startDate: Date, endDate: Date): Promise<number> {
  // Implementation
}
```

### Python

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions

```python
def train_model(data: pd.DataFrame, params: dict) -> Any:
    """
    Train a machine learning model.
    
    Args:
        data: Training data
        params: Model parameters
        
    Returns:
        Trained model
    """
    # Implementation
```

### C++

- Follow the existing C++17 style
- Use meaningful variable names
- Comment complex algorithms
- Include unit tests

## Commit Messages

Use conventional commits format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(recommendations): add ALS matrix factorization

Implemented alternating least squares algorithm for collaborative filtering.
Added C++ optimization module for fast inference.

Closes #123
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new features
4. Ensure no linting errors
5. Create a pull request with clear description

## Testing

### Backend Tests

```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
```

### ML Service Tests

```bash
cd ml_service
pytest
pytest --cov
```

## Questions?

Feel free to open an issue or contact the maintainers:
- Ocean: ocean@easy11.com
- Sameer: sameer@easy11.com

Thank you for contributing! 🎉

