document.addEventListener('DOMContentLoaded', () => {
    // Dados salvos no localStorage
    let imgsSalvas = JSON.parse(localStorage.getItem('galeriaImagens')) || [];
    let contEstilo = parseInt(localStorage.getItem('contadorTitulos')) || 0;

    // Elementos da galeria, formulário e os botões
    const galeriaContainer = document.querySelector('.galeria-container');
    const form = document.getElementById('form');
    const titImgInput = document.getElementById('title-img');
    const urlImgInput = document.getElementById('url-img');
    const erros = document.querySelectorAll('.msg-error');

    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('imgModal');
    const tituloModal = document.getElementById('titModal');
    const fechar = document.querySelector('.fecha');
    const btnEditar = document.getElementById('btnEditar');
    const btnExcluir = document.getElementById('btnExcluir');

    // Validação da imagem usando Image() para evitar erros de CORS
    function imgAcessivel(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);   // imagem carregou
            img.onerror = () => resolve(false); // erro ao carregar imagem
            img.src = url;
        });
    }

    // Função para adicionar imagem na galeria e o formato que vai ser mostrado
    function addNaGaleria(titulo, url, estiloAlternado, index) {
        const novoItem = document.createElement('div');
        novoItem.classList.add('galeria-items');

        const tituloImg = document.createElement("h3");
        tituloImg.classList.add(estiloAlternado ? 'tit-imgs2' : 'tit-imgs');
        tituloImg.textContent = titulo;

        const link = document.createElement('a');
        link.href = url;

        const imagem = document.createElement('img');
        imagem.src = url;
        imagem.alt = titulo;

        imagem.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = url;
            tituloModal.textContent = titulo;
            modal.dataset.indexAtual = index;
        })

        novoItem.appendChild(tituloImg);
        novoItem.appendChild(imagem);

        if (galeriaContainer) {
            galeriaContainer.appendChild(novoItem);
        }
    }

    // Se estiver na página da galeria, carrega as imagens salvas com os titulos alternados
    if (galeriaContainer) {
        imgsSalvas.forEach((imgObj, index) => {
            const estiloAlternado = index % 2 !== 0;
            addNaGaleria(imgObj.titImg, imgObj.url, estiloAlternado, index);
        });
    }

    // Se estiver na página do formulário: configura o evento de submit
    if (form && titImgInput && urlImgInput && erros.length === 2) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const titulo = titImgInput.value.trim();
            const url = urlImgInput.value.trim();
            let valido = true;

            erros.forEach(erro => {
                erro.textContent = '';
                erro.style.display = 'none';
            });

            // confirmação de preenchimento 
            if (!titulo) {
                erros[0].textContent = 'O campo do Título deve ser preenchido!';
                erros[0].style.display = 'inline';
                valido = false;
            }

            if (!url) {
                erros[1].textContent = 'O campo URL deve ser preenchido!';
                erros[1].style.display = 'inline';
                valido = false;
            }

            if (!valido) return;

            // se a URL não for valida aparece essa mensagem
            const acessivel = await imgAcessivel(url);
            if (!acessivel) {
                erros[1].textContent = 'A imagem não pôde ser carregada.';
                erros[1].style.display = 'inline';
                return;
            }

            // Recarrega imagens mais recentes (caso alguma tenha sido excluída não aparecerá)
            let imagensAtuais = JSON.parse(localStorage.getItem('galeriaImagens')) || [];
            imagensAtuais.push({ titImg: titulo, url });
            localStorage.setItem('galeriaImagens', JSON.stringify(imagensAtuais));

            contEstilo++;
            localStorage.setItem('contadorTitulos', contEstilo.toString());

            // Limpa campos e redireciona para galeria
            titImgInput.value = '';
            urlImgInput.value = '';
            window.location.href = 'galeria.html';
        });
    }

    // botão para fechar a modal
    const btnFechar = document.querySelector('.fecha');
    btnFechar.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    // botão editar
    btnEditar.addEventListener('click', () => {
        const index = parseInt(modal.dataset.indexAtual);
        if (isNaN(index)) return;

        const novoTit = prompt("Digite o novo título:", imgsSalvas[index].titImg);
        if (novoTit && novoTit.trim() !== '') {
            imgsSalvas[index].titImg = novoTit.trim();
            localStorage.setItem('galeriaImagens', JSON.stringify(imgsSalvas));
            modal.style.display = "none";
            location.reload();
        }
    });

    // botão excluir
    btnExcluir.addEventListener('click', () => {
        const index = parseInt(modal.dataset.indexAtual);
        if (isNaN(index)) return;

        const confirmeREsposta = confirm("Tem certeza que deseja excluir esta imagem!?");
        if (confirmeREsposta) {
            imgsSalvas.splice(index, 1);
            localStorage.setItem('galeriaImagens', JSON.stringify(imgsSalvas));
            modal.style.display = 'none';
            location.reload();
        }
    });
});
