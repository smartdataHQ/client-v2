<p align="center"><a href="https://fraios.com"><img src="https://github.com/smartdataHQ/client-v2/blob/master/public/FraioS-logo-darktheme.svg" alt="FraiOS Semantic Layer" width="300px"></a></p>

# FraiOS Semantic Layer Client

This is a client-side of the FraiOS Semantic Layer project!

## Requirements

Before using the client-side of the project, ensure that you have the following components installed:

- **NodeJS:** Version 20.8.1 or higher.
- **FraiOS Backend:** Ensure the [FraiOS backend](https://github.com/smartdataHQ/synmetrix/) is properly set up and running.

## Installation

To install the client-side of the project, follow these steps:

```bash
# Clone the FraiOS Semantic Layer Client repository
git clone https://github.com/smartdataHQ/client-v2

# Navigate to the project directory
cd client-v2

# Install required packages using Yarn
yarn

# Start the client-side application
yarn start
```

After completing these steps, open your web browser and go to [](http://localhost:8000) to access the FraiOS Semantic Layer client.

## Usage

For detailed guidance on utilizing the FraiOS Semantic Layer client and exploring its features, please consult the [FraiOS Documentation](https://docs.fraios.com/).

## Storybook Integration

Explore the interactive UI components and functionalities of the FraiOS Semantic Layer client using Storybook. Storybook provides a convenient environment to showcase and test UI components in isolation.

To launch Storybook, use the following command:

```bash
yarn storybook
```
Once the command is executed, navigate to [](http://localhost:6007)

## Code Linting

Maintain code consistency and quality in the FraiOS Semantic Layer client by implementing linting. Follow these steps to configure linting in Visual Studio Code (VS Code):

### Requirements:

- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Configuration:

1. Install ESLint and Prettier VS Code extensions.
2. Open your VS Code settings (settings.json) and add the following configuration:
```json
{
  "eslint.enable": true,
  "eslint.format.enable": true,
  "editor.formatOnSave": true
}
```

This configures VS Code to run ESLint and Prettier on file save.

## Conventional Commits

We adhere to the Conventional Commits specification to ensure consistent and meaningful commit messages. The structure of our commits follows the pattern:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

For a detailed understanding of Conventional Commits, refer to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

## Component Structure

In the FraiOS Semantic Layer project, components follow a consistent structure to enhance maintainability and organization. Each component typically consists of the following files:

1. **index.tsx:**
   The main file containing the component's implementation. This file includes the React component code.

2. **index.module.less:**
   A Less file containing the component's styles. Using module.less ensures that styles are scoped to the component and won't conflict with styles from other components.

3. **index.stories.tsx:**
   A file dedicated to Storybook stories for the component. Storybook stories help in visually testing and documenting the component's variations and use cases.

4. **index.test.tsx:**
   The file containing unit tests for the component using testing framework vitest. Writing tests ensures the reliability and correctness of the component's functionality.

Here's an example directory structure for a component named `ExampleComponent`:

```plaintext
/src
  /components
    /ExampleComponent
      index.tsx
      index.module.less
      index.stories.tsx
      index.test.tsx
```

## Testing

Ensure the reliability and correctness of the FraiOS Semantic Layer client by utilizing testing functionalities powered by Vitest. Vitest provides a robust testing framework to validate the behavior of your components and functionalities.

To run tests, use the following command:

```bash
yarn test
```

Executing this command will initiate the testing suite, allowing you to assess the client's performance and functionality. Any detected issues or failures will be highlighted, providing valuable insights for debugging and maintaining code quality.

## Build

Efficiently build and package the FraiOS Semantic Layer client with the following commands:

- **Build the Client:**
  ```bash
  yarn build
  ```
  This command utilizes Vite to build the FraiOS Semantic Layer client.

- **Post-Build Tasks:**
  ```bash
  yarn postbuild
  ```
  After the build, this command creates compressed archives (<b>dist.tar.gz</b> and <b>dist.zip</b>) of the generated distribution files.

- **Build Storybook:**
  ```bash
  yarn build-storybook
  ```
  Use this command to build the Storybook for the client.

- **Serve the Built Client Locally:**
  ```bash
  yarn serve
  ```
  This command previews the built client locally using Vite.

Incorporate these commands into your workflow to streamline the build process and prepare the FraiOS Semantic Layer client for deployment.

  