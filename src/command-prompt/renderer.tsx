import '../index.css';
import App from './prompt';
import { createRoot } from 'react-dom/client'

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
