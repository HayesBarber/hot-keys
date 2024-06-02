import '../index.css';
import { Prompt } from './prompt';
import { createRoot } from 'react-dom/client'

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Prompt />);
