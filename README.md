# Course Creator

Course Creator is a web-based application designed to empower educators and content creators to build interactive online courses easily. Built with Next.js and Tailwind CSS, this platform provides a user-friendly interface for creating, organizing, and managing course content through an innovative carousel-based editor.

## Features

- **Intuitive Course Management**: Create, edit, and organize courses with a simple interface  
- **Diverse Content Types**: Support for various content tiles including:
  - Text tiles  
  - Detailed description tiles  
  - Survey tiles  
  - Quiz tiles  
  - Form tiles  
- **Interactive Carousel Interface**: Navigate between content tiles with a smooth, responsive carousel  
- **Rich Text Editing**: Format text with bold, italic, alignment, and font size options  
- **Course Preview**: Preview your course as students would see it  
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices  

## Getting Started

### Prerequisites

- Node.js 18.x or later  
- npm, yarn, pnpm, or bun  

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/course-creator.git
   cd course-creator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages  
- `/src/components`: Reusable UI components  
- `/src/store`: State management using Zustand  
- `/src/types`: TypeScript type definitions  
- `/src/lib`: Utility functions and shared code  
- `/src/utils`: Helper utilities  

## Key Components

- **CourseCarousel**: Main interface for editing course content  
- **DetailsTile**: Component for creating detailed content with title and description  
- **TextTile**: Component for creating text-only content  
- **FormTile**: Component for creating form-based content  
- **PreviewCarousel**: Component for previewing course content  

## Technologies Used

- **Next.js** - React framework  
- **Tailwind CSS** - Utility-first CSS framework  
- **Zustand** - State management  
- **Radix UI** - Accessible UI components  
- **Framer Motion** - Animation library  
- **Embla Carousel** - Carousel component  
- **TinyMCE** - Rich text editor  

## Development

### Scripts

- `npm run dev` - Start development server  
- `npm run build` - Build for production  
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint  
- `npm run lint:fix` - Run ESLint with auto-fix  

### Code Style

This project uses ESLint and Prettier for code formatting. Pre-commit hooks are set up with Husky to ensure code quality.

## Contributing

1. Fork the repository  
2. Create your feature branch:  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:  
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:  
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request  

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Shadcn UI** - UI component collection  
- **Lucide Icons** - Icon library  
