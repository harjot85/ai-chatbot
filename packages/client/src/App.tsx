import { useEffect, useState } from 'react';
import './App.css';
import { Button } from '@/components/ui/button';

function App() {
    const [message, setMessage] = useState('Loading ....');

    useEffect(() => {
        fetch('/api/test')
            .then((response) => response.json())
            .then((data) => setMessage(data.message));
    }, []);

    return (
        <div>
            <p className="font-bold text-2xl">{message}</p>
            <div>
                <Button variant="destructive">Bun Button</Button>
            </div>
        </div>
    );
}
export default App;
