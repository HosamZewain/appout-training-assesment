import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@appout.com' },
        update: {},
        create: {
            email: 'admin@appout.com',
            password: hashedPassword,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // HTML Questions - Business & User-Focused
    const htmlQuestions = [
        {
            category: 'HTML',
            text: 'A client reports that users with screen readers cannot navigate your e-commerce product page. What is the MOST important HTML consideration?',
            type: 'MCQ',
            difficulty: 'EASY',
            points: 1,
            options: [
                { text: 'Using semantic HTML elements and proper alt attributes for accessibility', isCorrect: true },
                { text: 'Making the page load faster', isCorrect: false },
                { text: 'Adding more images to explain products', isCorrect: false },
                { text: 'Using more div elements for structure', isCorrect: false },
            ],
        },
        {
            category: 'HTML',
            text: 'Your marketing team wants to improve SEO rankings. Which HTML element should you prioritize for better search engine visibility?',
            type: 'MCQ',
            difficulty: 'EASY',
            points: 1,
            options: [
                { text: 'Semantic tags like <header>, <nav>, <article>, <main> and proper heading hierarchy', isCorrect: true },
                { text: 'Adding more <div> elements', isCorrect: false },
                { text: 'Using inline styles', isCorrect: false },
                { text: 'Increasing the number of images', isCorrect: false },
            ],
        },
        {
            category: 'HTML',
            text: 'You are building a form for a job application. Users are abandoning it halfway. What HTML feature could improve user experience?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Using proper input types (email, tel, date) and required attributes with clear labels', isCorrect: true },
                { text: 'Making all fields optional', isCorrect: false },
                { text: 'Removing all validation', isCorrect: false },
                { text: 'Using only text inputs for everything', isCorrect: false },
            ],
        },
        {
            category: 'HTML',
            text: 'A mobile user complains that phone numbers on your contact page are not clickable. How would you fix this to improve user experience?',
            type: 'SHORT_ANSWER',
            difficulty: 'EASY',
            points: 2,
            options: [],
        },
        {
            category: 'HTML',
            text: 'Your manager asks you to add a video tutorial to the homepage that works across all devices and has fallback content. Describe your approach.',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
    ];

    // CSS Questions - Design & Business Impact
    const cssQuestions = [
        {
            category: 'CSS',
            text: 'Your landing page has a high bounce rate on mobile devices. What CSS approach should you prioritize first?',
            type: 'MCQ',
            difficulty: 'EASY',
            points: 1,
            options: [
                { text: 'Implementing responsive design with mobile-first approach and media queries', isCorrect: true },
                { text: 'Adding more animations', isCorrect: false },
                { text: 'Using fixed pixel widths', isCorrect: false },
                { text: 'Increasing font sizes everywhere', isCorrect: false },
            ],
        },
        {
            category: 'CSS',
            text: 'The product team reports users are clicking non-clickable elements. What CSS property helps indicate interactivity?',
            type: 'MCQ',
            difficulty: 'EASY',
            points: 1,
            options: [
                { text: 'cursor: pointer; with hover states and visual feedback', isCorrect: true },
                { text: 'text-decoration: underline;', isCorrect: false },
                { text: 'font-weight: bold;', isCorrect: false },
                { text: 'font-size: larger;', isCorrect: false },
            ],
        },
        {
            category: 'CSS',
            text: 'Your e-commerce site loads slowly. The CSS file is 500KB. What is the BEST approach to improve performance?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Remove unused CSS, use CSS minification, and consider critical CSS inline', isCorrect: true },
                { text: 'Add more CSS to fix the issues', isCorrect: false },
                { text: 'Use only inline styles', isCorrect: false },
                { text: 'Remove all CSS and start over', isCorrect: false },
            ],
        },
        {
            category: 'CSS',
            text: 'A client needs their brand colors to be consistent across the entire site. Describe how you would structure your CSS for easy maintenance.',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'CSS',
            text: 'Users report that your checkout button is hard to find. Explain your approach to make it stand out while maintaining good design principles.',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
    ];

    // JavaScript Questions - Problem Solving & Business Logic
    const jsQuestions = [
        {
            category: 'JAVASCRIPT',
            text: 'A user submits a form with invalid email multiple times, causing server errors. What is the BEST practice to prevent this?',
            type: 'MCQ',
            difficulty: 'EASY',
            points: 1,
            options: [
                { text: 'Implement client-side validation before sending to server and disable submit button during processing', isCorrect: true },
                { text: 'Let server handle all validation', isCorrect: false },
                { text: 'Remove the submit button after first click permanently', isCorrect: false },
                { text: 'Alert user to stop clicking', isCorrect: false },
            ],
        },
        {
            category: 'JAVASCRIPT',
            text: 'Your e-commerce site needs to calculate totals in real-time as users add items. Which approach is most suitable?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Use event listeners on quantity changes and recalculate using array methods like reduce()', isCorrect: true },
                { text: 'Reload the entire page on each change', isCorrect: false },
                { text: 'Wait until checkout to calculate', isCorrect: false },
                { text: 'Use alert() to show prices', isCorrect: false },
            ],
        },
        {
            category: 'JAVASCRIPT',
            text: 'Users report seeing outdated data after updates. What JavaScript concept should you consider?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Asynchronous operations and state management - ensure UI updates after async calls complete', isCorrect: true },
                { text: 'Add more timeouts everywhere', isCorrect: false },
                { text: 'Refresh page automatically every second', isCorrect: false },
                { text: 'Use synchronous operations only', isCorrect: false },
            ],
        },
        {
            category: 'JAVASCRIPT',
            text: 'Your API endpoint returns 1000 products, but users only see 20 at a time. How would you handle this efficiently on the frontend?',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'JAVASCRIPT',
            text: 'A user accidentally clicks "Delete Account" button. Describe your approach to prevent accidental data loss while keeping good UX.',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'JAVASCRIPT',
            text: 'You need to integrate a third-party payment API. What considerations should you keep in mind for error handling?',
            type: 'SHORT_ANSWER',
            difficulty: 'HARD',
            points: 4,
            options: [],
        },
    ];

    // React Questions - Component Design & Real-World Scenarios
    const reactQuestions = [
        {
            category: 'REACT',
            text: 'You are building a dashboard that updates every 5 seconds with new data. Which React hook pattern is most appropriate?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'useEffect with setInterval and cleanup function to prevent memory leaks', isCorrect: true },
                { text: 'useState only', isCorrect: false },
                { text: 'Create new component every 5 seconds', isCorrect: false },
                { text: 'Use window.location.reload()', isCorrect: false },
            ],
        },
        {
            category: 'REACT',
            text: 'Your component re-renders too frequently, causing performance issues. What is the FIRST thing you should investigate?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Check if parent component state changes are causing unnecessary re-renders and use React.memo or useMemo', isCorrect: true },
                { text: 'Rewrite everything in vanilla JavaScript', isCorrect: false },
                { text: 'Remove all state from the component', isCorrect: false },
                { text: 'Add more key props randomly', isCorrect: false },
            ],
        },
        {
            category: 'REACT',
            text: 'A form with 20 fields is causing state management issues. What approach would you recommend for better organization?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Use a single state object with useReducer or form library like React Hook Form', isCorrect: true },
                { text: 'Create 20 separate useState calls', isCorrect: false },
                { text: 'Store everything in localStorage', isCorrect: false },
                { text: 'Use global variables', isCorrect: false },
            ],
        },
        {
            category: 'REACT',
            text: 'Your team is building a multi-page app where user authentication state is needed everywhere. Explain your approach to manage this globally.',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'REACT',
            text: 'A product listing page needs to filter, sort, and paginate 500 items. Describe how you would structure this component for maintainability.',
            type: 'SHORT_ANSWER',
            difficulty: 'HARD',
            points: 4,
            options: [],
        },
    ];

    // Angular Questions - Enterprise Application Patterns
    const angularQuestions = [
        {
            category: 'ANGULAR',
            text: 'Your Angular app needs to share user data across multiple components. What is the recommended Angular pattern?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Create a service with dependency injection to share data across components', isCorrect: true },
                { text: 'Use localStorage for all data', isCorrect: false },
                { text: 'Pass data through URL parameters only', isCorrect: false },
                { text: 'Duplicate the data in each component', isCorrect: false },
            ],
        },
        {
            category: 'ANGULAR',
            text: 'Users report slow page load on your Angular application. What built-in Angular feature helps with this?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Lazy loading modules to load only necessary code for each route', isCorrect: true },
                { text: 'Loading all modules at startup', isCorrect: false },
                { text: 'Removing all modules', isCorrect: false },
                { text: 'Using only one large component', isCorrect: false },
            ],
        },
        {
            category: 'ANGULAR',
            text: 'Your form needs real-time validation as users type. Which Angular approach is most suitable?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Reactive Forms with custom validators and valueChanges observable', isCorrect: true },
                { text: 'Template-driven forms with no validation', isCorrect: false },
                { text: 'Validate only on submit', isCorrect: false },
                { text: 'Use jQuery for validation', isCorrect: false },
            ],
        },
        {
            category: 'ANGULAR',
            text: 'Describe how you would structure an Angular application for a team of 5 developers to work simultaneously without conflicts.',
            type: 'SHORT_ANSWER',
            difficulty: 'HARD',
            points: 4,
            options: [],
        },
    ];

    // Node.js Questions - Backend Business Logic & Scalability
    const nodeQuestions = [
        {
            category: 'NODE',
            text: 'Your API endpoint is timing out because it processes large files. What is the best approach to handle this?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Use streams to process data in chunks and implement async processing or job queues', isCorrect: true },
                { text: 'Increase server timeout to 10 minutes', isCorrect: false },
                { text: 'Load entire file into memory at once', isCorrect: false },
                { text: 'Tell users to upload smaller files only', isCorrect: false },
            ],
        },
        {
            category: 'NODE',
            text: 'Users report intermittent errors on API calls. How should you implement error handling in Express.js?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Use try-catch blocks, error middleware, and return meaningful error responses with proper status codes', isCorrect: true },
                { text: 'Let the application crash and restart', isCorrect: false },
                { text: 'Always return 200 status regardless of errors', isCorrect: false },
                { text: 'Console.log errors only', isCorrect: false },
            ],
        },
        {
            category: 'NODE',
            text: 'Your application needs to send emails when users register. What is the BEST practice for handling this?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Use a background job queue (like Bull or Agenda) to send emails asynchronously', isCorrect: true },
                { text: 'Make user wait while email sends before showing success', isCorrect: false },
                { text: 'Send email in the same request-response cycle', isCorrect: false },
                { text: 'Skip sending emails to save time', isCorrect: false },
            ],
        },
        {
            category: 'NODE',
            text: 'Your API needs to handle sensitive user passwords. Describe your approach to storing and verifying them securely.',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'NODE',
            text: 'Multiple users are trying to book the same appointment slot simultaneously. How would you prevent double-booking?',
            type: 'SHORT_ANSWER',
            difficulty: 'HARD',
            points: 4,
            options: [],
        },
    ];

    // MongoDB Questions - Data Modeling & Business Requirements
    const mongoQuestions = [
        {
            category: 'MONGODB',
            text: 'Your e-commerce app needs to store products with multiple variations (size, color). How would you structure this in MongoDB?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Use embedded documents for variations within product document for easier querying', isCorrect: true },
                { text: 'Create separate collection for each variation', isCorrect: false },
                { text: 'Store everything as comma-separated strings', isCorrect: false },
                { text: 'Use only one field with all data', isCorrect: false },
            ],
        },
        {
            category: 'MONGODB',
            text: 'Users report slow search on your product catalog of 100,000 items. What MongoDB feature would help?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Create indexes on frequently queried fields like category, price, name', isCorrect: true },
                { text: 'Reduce number of products', isCorrect: false },
                { text: 'Load all products into memory', isCorrect: false },
                { text: 'Remove search functionality', isCorrect: false },
            ],
        },
        {
            category: 'MONGODB',
            text: 'A social media feature requires storing user posts with comments. Explain how you would model this relationship considering performance.',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'MONGODB',
            text: 'Your app needs to generate monthly sales reports from transaction data. Describe your approach using MongoDB aggregation.',
            type: 'SHORT_ANSWER',
            difficulty: 'HARD',
            points: 4,
            options: [],
        },
    ];

    // MySQL Questions - Data Integrity & Business Logic
    const mysqlQuestions = [
        {
            category: 'MYSQL',
            text: 'Your e-commerce platform needs to ensure that when an order is created, inventory is reduced. What MySQL feature helps maintain data integrity?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Use transactions with COMMIT and ROLLBACK to ensure both operations succeed or fail together', isCorrect: true },
                { text: 'Run two separate queries and hope both work', isCorrect: false },
                { text: 'Update inventory later manually', isCorrect: false },
                { text: 'Use only SELECT queries', isCorrect: false },
            ],
        },
        {
            category: 'MYSQL',
            text: 'A report query is taking 30 seconds on a table with 1 million rows. What should you check first?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Check if proper indexes exist on columns used in WHERE, JOIN, and ORDER BY clauses', isCorrect: true },
                { text: 'Delete half the data', isCorrect: false },
                { text: 'Buy more expensive servers', isCorrect: false },
                { text: 'Remove all WHERE clauses', isCorrect: false },
            ],
        },
        {
            category: 'MYSQL',
            text: 'You need to store user orders with multiple items. Explain your database schema design considering normalization and relationships.',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'MYSQL',
            text: 'A customer needs a list of users who have not made a purchase in the last 6 months. Write the approach to solve this query problem.',
            type: 'SHORT_ANSWER',
            difficulty: 'HARD',
            points: 4,
            options: [],
        },
    ];

    // General Problem Solving Questions
    const problemSolvingQuestions = [
        {
            category: 'GENERAL',
            text: 'Your application suddenly crashes in production but works fine locally. What is your systematic approach to debug this?',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'GENERAL',
            text: 'A feature that worked yesterday is broken today. No one deployed new code. What could be the reasons?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'External API changes, database state changes, environment variables modified, or certificate expiry', isCorrect: true },
                { text: 'The code magically broke itself', isCorrect: false },
                { text: 'Only DNS issues', isCorrect: false },
                { text: 'User error only', isCorrect: false },
            ],
        },
        {
            category: 'GENERAL',
            text: 'You need to choose between fixing a critical bug affecting 5% of users or implementing a feature requested by a major client. How do you decide?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Assess impact, communicate with stakeholders, prioritize based on business impact and user pain', isCorrect: true },
                { text: 'Always choose the new feature', isCorrect: false },
                { text: 'Ignore the bug since it only affects 5%', isCorrect: false },
                { text: 'Flip a coin', isCorrect: false },
            ],
        },
        {
            category: 'GENERAL',
            text: 'A client wants a feature delivered in 2 days but you estimate it needs 2 weeks. What do you do?',
            type: 'MCQ',
            difficulty: 'EASY',
            points: 1,
            options: [
                { text: 'Communicate timeline honestly, discuss MVP scope, and negotiate realistic expectations', isCorrect: true },
                { text: 'Work 24/7 without sleep', isCorrect: false },
                { text: 'Say yes and hope for the best', isCorrect: false },
                { text: 'Ignore the request', isCorrect: false },
            ],
        },
    ];

    // Code Syntax & Best Practices Questions
    const syntaxQuestions = [
        {
            category: 'JAVASCRIPT',
            text: 'What will this code output? `console.log(typeof null)`',
            type: 'MCQ',
            difficulty: 'EASY',
            points: 1,
            options: [
                { text: 'object', isCorrect: true },
                { text: 'null', isCorrect: false },
                { text: 'undefined', isCorrect: false },
                { text: 'string', isCorrect: false },
            ],
        },
        {
            category: 'JAVASCRIPT',
            text: 'Fix this code that should add two numbers: `function add(a, b) { return a + b; } add("5", 3);` What is the issue and how do you fix it?',
            type: 'SHORT_ANSWER',
            difficulty: 'EASY',
            points: 2,
            options: [],
        },
        {
            category: 'REACT',
            text: 'You see this warning: "Cannot update a component while rendering a different component." What does it mean and how do you fix it?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'State update happening during render - move state updates to useEffect or event handlers', isCorrect: true },
                { text: 'Too many components on the page', isCorrect: false },
                { text: 'Missing key prop', isCorrect: false },
                { text: 'Wrong import statement', isCorrect: false },
            ],
        },
        {
            category: 'CSS',
            text: 'Why does `margin: 0 auto;` center a block element horizontally?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Auto margins distribute available space equally on left and right when width is set', isCorrect: true },
                { text: 'It automatically detects the center pixel', isCorrect: false },
                { text: 'It uses JavaScript to calculate center', isCorrect: false },
                { text: 'It only works with flexbox', isCorrect: false },
            ],
        },
    ];

    // Code Debugging & Problems Questions
    const debuggingQuestions = [
        {
            category: 'JAVASCRIPT',
            text: 'Users report intermittent "undefined is not a function" errors. What is your debugging approach?',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'NODE',
            text: 'Your Node.js API starts responding slowly after running for a few hours. What could be causing this?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Memory leaks, unclosed connections, growing arrays, or blocking operations', isCorrect: true },
                { text: 'Node.js naturally slows down over time', isCorrect: false },
                { text: 'Too many files in the project', isCorrect: false },
                { text: 'Need to restart computer', isCorrect: false },
            ],
        },
        {
            category: 'REACT',
            text: 'Your list of 1000 items renders slowly. Users complain about lag when scrolling. What optimization techniques would you use?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'Implement virtualization (react-window), pagination, or infinite scroll to only render visible items', isCorrect: true },
                { text: 'Tell users to buy better computers', isCorrect: false },
                { text: 'Remove all styling', isCorrect: false },
                { text: 'Display only 10 items maximum', isCorrect: false },
            ],
        },
    ];

    // Practical Full-Stack Scenarios
    const practicalQuestions = [
        {
            category: 'GENERAL',
            text: 'You need to build a real-time chat feature. Describe your technology choices and architecture approach.',
            type: 'SHORT_ANSWER',
            difficulty: 'HARD',
            points: 4,
            options: [],
        },
        {
            category: 'NODE',
            text: 'How would you implement file upload functionality for images up to 10MB while ensuring security?',
            type: 'SHORT_ANSWER',
            difficulty: 'MEDIUM',
            points: 3,
            options: [],
        },
        {
            category: 'GENERAL',
            text: 'Your API is getting 1000 requests per second but can only handle 100. What strategies would you implement?',
            type: 'MCQ',
            difficulty: 'HARD',
            points: 3,
            options: [
                { text: 'Implement rate limiting, caching, load balancing, database optimization, and CDN for static assets', isCorrect: true },
                { text: 'Block 90% of users', isCorrect: false },
                { text: 'Just add more servers without optimization', isCorrect: false },
                { text: 'Tell users to wait', isCorrect: false },
            ],
        },
        {
            category: 'MYSQL',
            text: 'You need to migrate data from production database without downtime. Describe your approach.',
            type: 'SHORT_ANSWER',
            difficulty: 'HARD',
            points: 4,
            options: [],
        },
        {
            category: 'JAVASCRIPT',
            text: 'Explain the difference between `==` and `===` in JavaScript and when to use each.',
            type: 'MCQ',
            difficulty: 'EASY',
            points: 1,
            options: [
                { text: '== compares values with type coercion, === compares values and types; always prefer ===', isCorrect: true },
                { text: 'They are exactly the same', isCorrect: false },
                { text: '=== is slower so use ==', isCorrect: false },
                { text: '== is for numbers, === is for strings', isCorrect: false },
            ],
        },
        {
            category: 'REACT',
            text: 'When would you use useCallback vs useMemo in React?',
            type: 'MCQ',
            difficulty: 'MEDIUM',
            points: 2,
            options: [
                { text: 'useCallback memoizes functions, useMemo memoizes computed values; use when passing to child components or expensive calculations', isCorrect: true },
                { text: 'They are the same thing', isCorrect: false },
                { text: 'useCallback is deprecated', isCorrect: false },
                { text: 'Always use both everywhere', isCorrect: false },
            ],
        },
    ];

    // Combine all questions
    const allQuestions = [
        ...htmlQuestions,
        ...cssQuestions,
        ...jsQuestions,
        ...reactQuestions,
        ...angularQuestions,
        ...nodeQuestions,
        ...mongoQuestions,
        ...mysqlQuestions,
        ...problemSolvingQuestions,
        ...syntaxQuestions,
        ...debuggingQuestions,
        ...practicalQuestions,
    ];

    // Create questions with options
    let orderIndex = 0;
    for (const q of allQuestions) {
        const question = await prisma.question.create({
            data: {
                category: q.category as any,
                text: q.text,
                type: q.type as any,
                difficulty: q.difficulty as any,
                points: q.points,
                orderIndex: orderIndex++,
            },
        });

        if (q.options.length > 0) {
            for (let i = 0; i < q.options.length; i++) {
                await prisma.option.create({
                    data: {
                        questionId: question.id,
                        text: q.options[i].text,
                        isCorrect: q.options[i].isCorrect,
                        orderIndex: i,
                    },
                });
            }
        }
    }

    console.log(`✅ Created ${allQuestions.length} questions across 8 categories`);
    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
