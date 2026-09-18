import React, { useState } from 'react';

export function TrabalheConosco() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    vaga_interesse: '',
    escolaridade: '',
    experiencia: '',
    habilidades: '',
    sobre: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrorMsg('Apenas arquivos PDF são permitidos para o currículo.');
        return;
      }
      setPdfFile(file);
      setPdfName(file.name);
      setErrorMsg('');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setPdfName(file.name);
        setErrorMsg('');
      } else {
        setErrorMsg('Por favor, arraste apenas arquivos PDF.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!fotoFile) {
      setErrorMsg('A Foto de perfil é obrigatória.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('nome', formData.nome);
      data.append('whatsapp', formData.whatsapp);
      data.append('email', formData.email);
      data.append('vaga_interesse', formData.vaga_interesse);
      data.append('escolaridade', formData.escolaridade);
      data.append('experiencia', formData.experiencia);
      data.append('habilidades', formData.habilidades);
      data.append('sobre', formData.sobre);
      
      data.append('foto', fotoFile);
      if (pdfFile) {
        data.append('curriculo', pdfFile);
      }

      // Endpoint API PHP no servidor Admin
      const response = await fetch('https://administrativo.gmcelular.com.br/trabalhe-conosco/submit', {
        method: 'POST',
        body: data,
        // Ao usar FormData, o navegador define automaticamente o content-type para multipart/form-data
      });

      if (!response.ok) {
         throw new Error(`Erro na comunicação com o servidor (${response.status})`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao salvar candidatura');
      }

      setSuccess(true);
      window.scrollTo(0, 0);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg text-center w-full border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Candidatura Enviada!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Agradecemos o seu interesse em fazer parte da esquipe GM Celular. Nossa equipe de recrutamento analisará seu perfil e entraremos em contato via WhatsApp caso haja sinergia com nossas vagas.
          </p>
          <a href="/" className="inline-block w-full py-3.5 px-6 bg-[#136dec] hover:bg-[#0e55dd] text-white font-medium rounded-lg transition-colors shadow-md">
            Voltar para o site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header Minimalista */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
            <div className="bg-[#136dec] text-white font-bold text-xl px-3 py-1 rounded tracking-tight">GM</div>
        </div>
      </nav>

      {/* Hero Banner Style */}
      <div 
        className="h-[300px] flex items-center justify-center relative overflow-hidden bg-[#136dec]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://gmcelular.com.br/wp-content/uploads/2023/10/GM-Celular-Loja.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="text-center text-white px-4 relative z-10 w-full max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">Junte-se à nossa equipe</h1>
            <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed">
                Faça parte da melhor assistência técnica e loja de celulares da região.<br className="hidden md:block"/>
                Buscamos talentos apaixonados por tecnologia.
            </p>
        </div>
      </div>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 mb-20 -mt-[80px] relative z-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-6 md:p-10">
                {errorMsg && (
                  <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="font-medium">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                    
                    {/* SESSÃO 1 */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-[#136dec] mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Dados Pessoais e Perfil
                        </h2>
                        
                        {/* Upload Foto */}
                        <div className="flex flex-col items-center mb-10 bg-slate-50 p-8 rounded-xl border border-dashed border-slate-200 transition-colors hover:border-[#136dec]">
                            <label htmlFor="fotoInput" className="w-32 h-32 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden relative shadow-sm group hover:border-[#136dec]">
                                {!fotoPreview ? (
                                    <div className="text-slate-400 flex flex-col items-center group-hover:text-[#136dec] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                ) : (
                                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover absolute top-0 left-0 z-10" />
                                )}
                            </label>
                            <input type="file" id="fotoInput" accept="image/*" className="hidden" onChange={handleFotoChange} />
                            
                            <h3 className="font-semibold text-slate-800 mt-4">Sua Foto de Rosto <span className="text-red-500">*</span></h3>
                            <p className="text-sm text-slate-500 mb-4 mt-1 text-center max-w-xs">Escolha uma foto clara e profissional para o seu perfil</p>
                            
                            <button type="button" onClick={() => document.getElementById('fotoInput')?.click()} className="text-sm bg-white border border-slate-300 shadow-sm text-slate-700 px-5 py-2 rounded-full hover:bg-slate-50 transition-colors font-medium">
                                Selecionar Imagem
                            </button>
                        </div>

                        {/* Grid Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo <span className="text-red-500">*</span></label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20 transition-all placeholder-slate-400" placeholder="Ex: João da Silva"/>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp / Celular <span className="text-red-500">*</span></label>
                                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20 transition-all placeholder-slate-400" placeholder="(11) 90000-0000"/>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20 transition-all placeholder-slate-400" placeholder="seu@email.com"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vaga <span className="text-red-500">*</span></label>
                                    <select name="vaga_interesse" value={formData.vaga_interesse} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20 transition-all">
                                        <option value="">Selecione</option>
                                        <option value="Vendas">Vendas</option>
                                        <option value="Técnico de Manutenção">Técnico</option>
                                        <option value="Atendimento">Atendimento</option>
                                        <option value="Administrativo">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Escolaridade <span className="text-red-500">*</span></label>
                                    <select name="escolaridade" value={formData.escolaridade} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20 transition-all">
                                        <option value="">Selecione</option>
                                        <option value="Ensino Médio Incompleto">Médio Inc.</option>
                                        <option value="Ensino Médio Completo">Médio Comp.</option>
                                        <option value="Ensino Técnico">Técnico</option>
                                        <option value="Superior Cursando">Superior Curs.</option>
                                        <option value="Superior Completo">Superior Comp.</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SESSÃO 2 */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-[#136dec] mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Experiência e Qualificações
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experiência Profissional</label>
                                <textarea name="experiencia" value={formData.experiencia} onChange={handleInputChange} rows={4} className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20 transition-all placeholder-slate-400" placeholder="Ex: Trabalhei 2 anos como vendedor na loja X. Minhas funções eram atender clientes, fechar caixa..."></textarea>
                                <p className="text-xs text-slate-500 mt-1.5 font-medium">Conte onde você já trabalhou e o que fazia lá.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Habilidades e Cursos</label>
                                <textarea name="habilidades" value={formData.habilidades} onChange={handleInputChange} rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20 transition-all placeholder-slate-400" placeholder="Ex: Manutenção de iPhone, Vendas consultivas, Curso de Informática Básica..."></textarea>
                                <p className="text-xs text-slate-500 mt-1.5 font-medium">Quais cursos você tem? O que você sabe fazer de melhor?</p>
                            </div>
                        </div>
                    </div>

                    {/* SESSÃO 3 */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-[#136dec] mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Sobre Você
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-semibold text-slate-700">Por que você quer trabalhar conosco?</label>
                                </div>
                                <textarea name="sobre" value={formData.sobre} onChange={handleInputChange} rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#136dec] focus:ring-2 focus:ring-[#136dec]/20 transition-all placeholder-slate-400" placeholder="Conte-nos seus objetivos profissionais e motivações..."></textarea>
                            </div>

                            <div className="mt-8 pt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Anexar Currículo (Opcional, apenas PDF)</label>
                                <div 
                                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${pdfFile ? 'border-[#136dec] bg-[#136dec]/5' : 'border-slate-300 bg-slate-50 hover:border-[#136dec] hover:bg-[#136dec]/5'}`}
                                  onDragOver={handleDragOver}
                                  onDrop={handleDrop}
                                  onClick={() => document.getElementById('pdfInput')?.click()}
                                >
                                    <input type="file" id="pdfInput" className="hidden" accept=".pdf" onChange={handlePdfChange} />
                                    
                                    <div className="flex flex-col items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mb-3 ${pdfFile ? 'text-[#136dec]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-base font-semibold text-slate-700 mb-1">
                                            {pdfName ? 'Arquivo selecionado' : 'Clique para carregar ou arraste o PDF'}
                                        </p>
                                        {pdfName ? (
                                            <p className="text-sm text-[#136dec] font-medium">{pdfName}</p>
                                        ) : (
                                            <p className="text-sm text-slate-500">Tamanho máximo de 5MB.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-8 border-t border-slate-200 mt-10">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full md:w-auto px-10 py-4 bg-[#136dec] hover:bg-[#0e55dd] text-white text-lg font-bold rounded-xl shadow-lg border border-transparent transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-xl'}`}
                        >
                            {loading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                  Processando envio...
                                </>
                            ) : (
                                <>
                                  Enviar Candidatura
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </>
                            )}
                        </button>
                        <p className="text-sm text-slate-400 mt-5 text-center md:text-left font-medium">
                            <span className="text-slate-500">🔒 Segurança LGPD:</span> Ao enviar, você concorda que armazenaremos seus dados exclusivamente para processos seletivos da GM Celular.
                        </p>
                    </div>

                </form>
            </div>
        </div>
      </main>

      <footer className="bg-white py-8 mt-auto border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                  <div className="bg-[#136dec] text-white font-bold text-xs px-2 py-1 rounded">GM</div>
                  &copy; {new Date().getFullYear()} GM Celular. Todos os direitos reservados.
              </div>
          </div>
      </footer>
    </div>
  );
}
