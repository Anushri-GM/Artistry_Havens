# Artistry Havens

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue?logo=tailwind-css)

Artistry Havens is a modern web application designed to empower Indian artisans by providing a comprehensive platform to showcase their creations, connect with a global audience, and grow their business. It leverages AI-powered tools to simplify content creation and provides valuable analytics to help artisans thrive.

## ✨ Features

- **Multilingual Support**: Content is displayed in multiple Indian languages based on user selection.
- **Artisan Onboarding**: A seamless process for artisans to create detailed profiles.
- **AI-Powered Product Management**:
    - Upload product images and have AI generate compelling names, descriptions, and stories.
    - Generate high-quality product images from text descriptions.
- **AI-Powered Content Generation**:
    - Automatically create engaging posts for social media platforms like Instagram and Facebook.
    - Generate unique icons for different craft categories.
- **Analytics Dashboard**: Artisans get insights into product performance, including views, likes, and revenue.
- **AI-Powered Reviews**: An AI tool analyzes product data and provides actionable feedback for improvement.
- **Sponsor Matching**: A dedicated portal for artisans to connect with sponsors and manage partnerships.
- **Buyer & Sponsor Portals**: Separate, tailored experiences for buyers looking for unique crafts and sponsors wishing to support artisans.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Google's Genkit](https://firebase.google.com/docs/genkit) with Gemini models.
- **Deployment**: Configured for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

## ⚙️ Configuration

- **Environment Variables**: All required API keys and environment-specific settings are managed in the `.env` file at the project root. See the `Installation` section for an example.
- **Firebase**: The project is configured for deployment on Firebase App Hosting via `apphosting.yaml`. Further Firebase service configurations (like Auth or Firestore) would require setup in the Firebase Console.
- **Styling**: The application's color palette and theme are defined in `src/app/globals.css` using Tailwind CSS variables, following the ShadCN UI theme structure.

## 🧪 Testing

This starter project does not include a pre-configured testing framework. To add testing, you can integrate a framework like [Jest](https://jestjs.io/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

1.  **Install testing dependencies:**
    ```bash
    npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
    ```
2.  **Configure Jest:** Create a `jest.config.js` file and set up your test environment.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please ensure your code adheres to the existing style and that you have tested your changes thoroughly.

## 📜 License

This project is distributed under the MIT License. See `LICENSE.txt` for more information.

## 🙏 Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) for the fantastic component library.
- [Genkit](https://firebase.google.com/docs/genkit) for simplifying AI integration.
- [Lucide React](https://lucide.dev/) for the beautiful icon set.
