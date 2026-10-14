import { renderToString } from 'react-dom/server';
import App from './main';
export { contact } from './config';

export function render() {
  return renderToString(<App />);
}
