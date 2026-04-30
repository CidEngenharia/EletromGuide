# -*- coding: utf-8 -*-
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace FAQSection AnimatePresence
faq_pattern = re.compile(r'<AnimatePresence>\s*\{openIndex === i && \(\s*<motion\.div[^>]+>\s*<div className="px-6 pb-5 text-slate-400 leading-relaxed">\s*\{faq\.a\}\s*</div>\s*</motion\.div>\s*\)\}\s*</AnimatePresence>', re.DOTALL)
content = faq_pattern.sub(r'''{openIndex === i && (
                <div className="px-6 pb-5 text-slate-400 leading-relaxed bg-white/5">
                  {faq.a}
                </div>
              )}''', content)

# Remove Form column
form_pattern = re.compile(r'\{\/\* Form Column \*\/}.*?(?=\s*<\/div>\s*<\/div>\s*\{\/\* Comparison Table Section \*\/})', re.DOTALL)
content = form_pattern.sub('', content)

# Change bg of FAQSection
content = content.replace('<section className="py-20 px-6 bg-[#1E1B4B]">', '<section className="py-20 px-6 bg-[#0f0814]">')

# Center the Hero texts
content = content.replace('className="relative z-10 max-w-xl pt-10"', 'className="relative z-10 max-w-4xl pt-10 flex flex-col items-center"')
content = content.replace('className="text-white/70 mb-10 leading-relaxed font-medium max-w-md text-base md:text-lg"', 'className="text-white/70 mb-10 leading-relaxed font-medium max-w-2xl text-base md:text-xl text-center"')
content = content.replace('className="text-4xl md:text-6xl font-black text-violet-700 leading-[1.05] mb-4 tracking-tighter"', 'className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter text-center"')

# Replace Hub text
content = content.replace('Hub de serviços técnicos', 'Hub de serviços técnicos.<br/>\n              <span className="text-violet-500">Tudo no controle.</span>')

# Add Test button
test_button = r'''<div className="mb-16 flex flex-col sm:flex-row gap-4 justify-center w-full">
              <button 
                onClick={() => {
                  onLogin({
                    id: 'trial-user',
                    name: 'Usuário de Teste',
                    email: 'teste@eletromguide.com.br',
                    role: 'TECNICO',
                    companyId: 'trial-comp'
                  }, 7);
                }}
                className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 mx-auto"
              >
                Testar Grátis Agora
              </button>
            </div>'''
content = content.replace('<div id="recursos"', test_button + '\n\n            <div id="recursos"')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
