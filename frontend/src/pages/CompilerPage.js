import React, { useState, useContext } from 'react';
import { Container, Typography, Select, MenuItem, Button, Box, Paper, CircularProgress, TextField, IconButton } from '@mui/material';
import Editor from '@monaco-editor/react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Judge0 Language IDs
const LANGUAGE_OPTIONS = {
    'Python': 71,
    'Java': 62,
    'C++': 54,
    'C': 50
};

// NEW: Boilerplate code for each language
const BOILERPLATE_CODE = {
    'Python': `def main():
    # Write your code here
    print("Hello, Python!")

if __name__ == "__main__":
    main()`,
    'Java': `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, Java!");
    }
}`,
    'C++': `#include <iostream>

int main() {
    // Write your code here
    std::cout << "Hello, C++!";
    return 0;
}`,
    'C': `#include <stdio.h>

int main() {
    // Write your code here
    printf("Hello, C!");
    return 0;
}`
};


const CompilerPage = () => {
    const [language, setLanguage] = useState(() => sessionStorage.getItem('compilerLanguage') || 'Python');
    const [code, setCode] = useState(() => sessionStorage.getItem('compilerCode') || BOILERPLATE_CODE['Python']);
    const [input, setInput] = useState(() => sessionStorage.getItem('compilerInput') || '');
    const [output, setOutput] = useState(() => sessionStorage.getItem('compilerOutput') || '');
    const [isLoading, setIsLoading] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const { token } = useContext(AuthContext);

    // UPDATED: This handler now sets the boilerplate code
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        sessionStorage.setItem('compilerLanguage', newLang);
        
        // Set the boilerplate for the new language
        const newBoilerplate = BOILERPLATE_CODE[newLang];
        setCode(newBoilerplate);
        sessionStorage.setItem('compilerCode', newBoilerplate);
    };

    const handleCodeChange = (value) => {
        setCode(value);
        sessionStorage.setItem('compilerCode', value);
    };

    const handleInputChange = (e) => {
        const newInput = e.target.value;
        setInput(newInput);
        sessionStorage.setItem('compilerInput', newInput);
    };

    const handleRun = async () => {
        setIsLoading(true);
        setOutput('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                language_id: LANGUAGE_OPTIONS[language],
                source_code: code,
                stdin: input
            };
            const { data } = await api.post('/api/compiler/run', payload, config);

            const result = data.stdout || data.stderr || data.compile_output || data.status.description;
            setOutput(result);
            sessionStorage.setItem('compilerOutput', result);
        } catch (error) {
            setOutput('An error occurred while running the code.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Practice Compiler</Typography>
            <Paper sx={{ p: 2, position: 'relative' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Select value={language} onChange={handleLanguageChange}>
                        {Object.keys(LANGUAGE_OPTIONS).map(lang => (
                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained" onClick={handleRun} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'Run Code'}
                    </Button>
                </Box>
                
                <Box sx={{ position: 'absolute', top: 18, right: 18, zIndex: 1 }}>
                    <IconButton size="small" onClick={() => setFontSize(prev => prev + 1)}>
                        <AddIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => setFontSize(prev => Math.max(10, prev - 1))}>
                        <RemoveIcon />
                    </IconButton>
                </Box>

                <Editor
                    height="50vh"
                    language={language.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={handleCodeChange}
                    options={{ fontSize: fontSize }}
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField label="Input (stdin)" multiline rows={4} variant="outlined" fullWidth value={input} onChange={handleInputChange} />
                    <TextField label="Output" multiline rows={4} variant="outlined" fullWidth value={output} InputProps={{ readOnly: true }} />
                </Box>
            </Paper>
        </Container>
    );
};

export default CompilerPage;