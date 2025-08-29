// ========================================
// SCRIPT PRINCIPAL - PORTFÓLIO PESSOAL
// ========================================
// Este arquivo contém toda a funcionalidade JavaScript para o portfólio
// Inclui: sistema de abas, formulário de contato e animações

// Aguarda o DOM estar completamente carregado antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // SISTEMA DE ABAS
    // ========================================
    
    // Seleção de todos os elementos necessários para o sistema de abas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Função para alternar entre as abas
    // Parâmetro: tabId - ID da aba que deve ser ativada
    function switchTab(tabId) {
        // Remove a classe 'active' de todos os botões e painéis
        // Isso garante que apenas uma aba esteja ativa por vez
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Adiciona a classe 'active' ao botão e painel selecionados
        // Usa seletores específicos para encontrar os elementos corretos
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // Adiciona event listeners para cada botão de aba
    // Isso permite que os usuários cliquem nas abas para navegar
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // ========================================
    // FORMULÁRIO DE CONTATO
    // ========================================
    
    // Função para lidar com o envio do formulário de contato
    // Implementa envio para uma função serverless em /api/send-email
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('.submit-btn');
        const originalLabel = submitButton ? submitButton.innerHTML : '';

        // Captura dos campos
        const formPayload = {
            name: this.name.value.trim(),
            email: this.email.value.trim(),
            subject: this.subject.value.trim(),
            message: this.message.value.trim()
        };

        // Validação simples no cliente para evitar chamadas desnecessárias
        if (!formPayload.name || !formPayload.email || !formPayload.message) {
            alert('Por favor, preencha Nome, Email e Mensagem.');
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            }

            // Chamada à rota serverless
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formPayload)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                // Mostra mensagem de erro amigável
                const errorMessage = result && result.error ? result.error : 'Não foi possível enviar a mensagem agora.';
                alert(`Erro: ${errorMessage}`);
                return;
            }

            // Sucesso
            alert('Mensagem enviada com sucesso!');
            this.reset();
        } catch (err) {
            alert('Falha de conexão ao enviar. Verifique sua internet e tente novamente.');
            console.error(err);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalLabel;
            }
        }
    });

    // ========================================
    // ANIMAÇÕES DAS BARRAS DE HABILIDADES
    // ========================================
    
    // Função para animar as barras de habilidades
    // Cria um efeito visual de carregamento das barras de progresso
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            // Armazena a largura final da barra
            const finalWidth = bar.style.width;
            
            // Inicia a barra com 0% de largura
            bar.style.width = '0%';
            
            // Após um pequeno delay, anima para a largura final
            // O delay cria um efeito mais suave e visualmente agradável
            setTimeout(() => {
                bar.style.width = finalWidth;
            }, 100);
        });
    }

    // Anima as barras quando a aba de habilidades é aberta
    // Adiciona um listener específico para o botão da aba de habilidades
    document.querySelector('[data-tab="habilidades"]').addEventListener('click', () => {
        // Aguarda 300ms para garantir que a transição da aba seja concluída
        // antes de iniciar a animação das barras
        setTimeout(animateSkillBars, 300);
    });

    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    
    // Log de inicialização para debug (pode ser removido em produção)
    console.log('Portfólio inicializado com sucesso!');
    
    // Ativa a primeira aba por padrão (opcional)
    // Descomente a linha abaixo se quiser que uma aba específica seja ativa ao carregar
    // switchTab('sobre'); // ou 'projetos', 'habilidades', 'contato'
    
});

// ========================================
// FUNÇÕES AUXILIARES (se necessário)
// ========================================
// Aqui você pode adicionar funções adicionais conforme necessário

// Exemplo de função para validação de formulário
function validateContactForm(formData) {
    // Implementar validação dos campos do formulário
    // Retornar true se válido, false caso contrário
    return true;
}

// Exemplo de função para formatação de dados
function formatContactData(formData) {
    // Formatar dados antes do envio
    return formData;
}
