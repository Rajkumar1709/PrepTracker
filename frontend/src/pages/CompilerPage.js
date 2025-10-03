import React, { useState, useContext } from 'react';
import {
    Container,
    Select,
    MenuItem,
    Button,
    Box,
    Paper,
    CircularProgress,
    Typography,
    IconButton,
    useTheme,
    TextField,
    useMediaQuery
} from '@mui/material';
import Editor from '@monaco-editor/react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Allotment } from "allotment";
import "allotment/dist/style.css";

// Judge0 Language IDs
const LANGUAGE_OPTIONS = {
    'Python': 71,
    'Java': 62,
    'C++': 54,
    'C': 50
};

// Boilerplate code for each language
const BOILERPLATE_CODE = {
    'Python': `def main():\n    # Read input using input()\n    # Example: name = input()\n    print("Hello, Python!")\n\nif __name__ == "__main__":\n    main()`,
    'Java': `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Read input using Scanner\n        // Scanner scanner = new Scanner(System.in);\n        System.out.println("Hello, Java!");\n    }\n}`,
    'C++': `#include <iostream>\n\nint main() {\n    // Read input using std::cin\n    std::cout << "Hello, C++!";\n    return 0;\n}`,
    'C': `#include <stdio.h>\n\nint main() {\n    // Read input using scanf\n    printf("Hello, C!");\n    return 0;\n}`
};

const CompilerPage = () => {
    const [language, setLanguage] = useState(() => sessionStorage.getItem('compilerLanguage') || 'Python');
    const [code, setCode] = useState(() => sessionStorage.getItem('compilerCode') || BOILERPLATE_CODE['Python']);
    const [input, setInput] = useState(() => sessionStorage.getItem('compilerInput') || '');
    const [output, setOutput] = useState(() => sessionStorage.getItem('compilerOutput') || 'Click "Run" to see the output here.');
    const [isLoading, setIsLoading] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const { token } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        sessionStorage.setItem('compilerLanguage', newLang);
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
        setOutput('Running your code...');
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

    const headerControls = (
        <Paper square elevation={2} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Select size="small" value={language} onChange={handleLanguageChange}>
                {Object.keys(LANGUAGE_OPTIONS).map(lang => (<MenuItem key={lang} value={lang}>{lang}</MenuItem>))}
            </Select>
            <Button 
                variant="contained" 
                color="success" 
                onClick={handleRun} 
                disabled={isLoading} 
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            >
                Run
            </Button>
            <Box sx={{ ml: 'auto' }}>
                <IconButton title="Increase font size" size="small" onClick={() => setFontSize(prev => prev + 1)}>
                    <AddIcon fontSize="small" />
                </IconButton>
                <IconButton title="Decrease font size" size="small" onClick={() => setFontSize(prev => Math.max(10, prev - 1))}>
                    <RemoveIcon fontSize="small" />
                </IconButton>
            </Box>
        </Paper>
    );

    const editorPane = (
        <Editor
            language={language.toLowerCase()}
            theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
            value={code}
            onChange={handleCodeChange}
            options={{ fontSize: fontSize }}
        />
    );

    const inputPane = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="overline" sx={{ px: 2, pt: 1, color: 'text.secondary' }}>Input (stdin)</Typography>
            <TextField
                multiline
                fullWidth
                variant="outlined"
                value={input}
                onChange={handleInputChange}
                sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': { height: '100%', alignItems: 'flex-start', borderRadius: 0, border: 'none' },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& textarea': { fontFamily: 'monospace' }
                }}
            />
        </Box>
    );

    const outputPane = (
        <Box sx={{ height: '100%', p: 2, bgcolor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#fafafa', color: 'text.primary', overflowY: 'auto', fontFamily: 'monospace' }}>
            <Typography variant="overline">Output</Typography>
            <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, fontSize: 14 }}>
                {output}
            </Box>
        </Box>
    );

    return (
        <Container 
            maxWidth={false} 
            sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', p: '0 !important' }}
        >
            {headerControls}
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                {isMobile ? (
                    <Allotment vertical>
                        <Allotment.Pane preferredSize="60%">{editorPane}</Allotment.Pane>
                        <Allotment.Pane preferredSize="20%">{inputPane}</Allotment.Pane>
                        <Allotment.Pane preferredSize="20%">{outputPane}</Allotment.Pane>
                    </Allotment>
                ) : (
                    <Allotment>
                        <Allotment.Pane minSize={400}>{editorPane}</Allotment.Pane>
                        <Allotment.Pane>
                            <Allotment vertical>
                                <Allotment.Pane snap>{inputPane}</Allotment.Pane>
                                <Allotment.Pane>{outputPane}</Allotment.Pane>
                            </Allotment>
                        </Allotment.Pane>
                    </Allotment>
                )}
            </Box>
        </Container>
    );
};

export default CompilerPage;