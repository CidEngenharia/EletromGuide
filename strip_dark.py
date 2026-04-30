import re
import os

filepath = 'src/App.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove dark: classes
content = re.sub(r'\s*dark:[\w\-\[\]/#%]+', '', content)

# 2. Remove isDarkMode state
content = re.sub(r'  const \[isDarkMode, setIsDarkMode\] = useState\(\(\) => localStorage\.getItem\(\'theme\'\) === \'dark\'\);\n', '', content)

# 3. Remove isDarkMode useEffect
effect_pattern = r'  useEffect\(\(\) => \{\n    if \(isDarkMode\) \{\n      document\.documentElement\.classList\.add\(\'dark\'\);\n      localStorage\.setItem\(\'theme\', \'dark\'\);\n    \} else \{\n      document\.documentElement\.classList\.remove\(\'dark\'\);\n      localStorage\.setItem\(\'theme\', \'light\'\);\n    \}\n  \}, \[isDarkMode\]\);\n\n'
content = re.sub(effect_pattern, '', content)

# 4. Remove dark button toggle in the header
button_pattern = r'            <div className=\"flex items-center gap-2 border-r border-slate-100 pr-4 mr-1\">\n              <button\n                onClick=\{\(\) => setIsDarkMode\(!isDarkMode\)\}\n                className=\"p-2\.5 text-slate-400 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all\"\n                title=\{isDarkMode \? \"Ativar modo claro\" : \"Ativar modo escuro\"\}\n              >\n                \{isDarkMode \? <Sun size=\{18\} className=\"text-amber-400\" /> : <Moon size=\{18\} className=\"text-slate-600\" />\}\n              </button>\n            </div>\n'
content = re.sub(button_pattern, '', content)

# 5. Remove isDarkMode props from components
content = re.sub(r' isDarkMode=\{isDarkMode\} toggleTheme=\{\(\) => setIsDarkMode\(!isDarkMode\)\}', '', content)

# 6. Replace specific inline styles that use isDarkMode
content = content.replace("background: isDarkMode ? 'rgba(2,6,23,0.85)' : 'rgba(248,250,252,0.85)'", "background: 'rgba(248,250,252,0.85)'")
content = content.replace("fill={isDarkMode ? '#1e293b' : '#f1f5f9'}", "fill={'#f1f5f9'}")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Replaced App.tsx')
