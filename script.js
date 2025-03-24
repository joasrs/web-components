const enderecos =  [
    {nome:'João da Silva', telefone: '47 98798-12518', endereco: 'Rua XV de novembro, 531', cidade: 'Itajaí', uf: 'SC'},
    {nome:'Mario da Silva', telefone: '47 98798-48154', endereco: 'Rua XV de outubro, 15', cidade: 'Balneário Camboriú', uf: 'SC'},
    {nome:'João de Souza', telefone: '48 97887-68154', endereco: 'Rua 13 de julho, 48', cidade: 'Florianópolis', uf: 'SC'},
    {nome:'João Maria', telefone: '45 99978-78125', endereco: 'Rua 7 de setembro, 654', cidade: 'Curitiba', uf: 'PR'},
    {nome:'Maria João', telefone: '11 97987-58125', endereco: 'Rua 21 de abril, 654', cidade: 'São Paulo', uf: 'SP'},
    {nome:'Silva e Souza', telefone: '47 99997-65484', endereco: 'Rua 01 de abril, 21', cidade: 'Itajaí', uf: 'SC'},
    {nome:'Jacinto Filho', telefone: '85 99914-12184', endereco: 'Rua 25 de dezembro, 151', cidade: 'Rio Branco', uf: 'AC'},
    {nome:'Telêmaco Borba', telefone: '51 97487-88429', endereco: 'Rua Marechal Rondom, 315', cidade: 'Porto Alegre', uf: 'RS'},
    {nome:'Hugo Chaves', telefone: '47 94156-98781', endereco: 'Rua Candido Mariano, 651', cidade: 'Blumenau', uf: 'SC'},
    {nome:'Evita Perón', telefone: '47 98748-61258', endereco: 'Avenida Afonso Pena, 2316', cidade: 'Camboriú', uf: 'SC'}
    ];

// componentes ----

class ListaContatos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.setAttribute('ufpesquisa', '')
        this.gerarListaContatos();
    }

    gerarListaContatos(){
        const divLista = document.createElement('div');
        divLista.style = `
            display: flex;
            flex-wrap: wrap;
        `;

        const ufPesquisa = this.getAttribute('ufpesquisa');
        enderecos.filter((e) => ufPesquisa ? ufPesquisa.toUpperCase() === e.uf.toUpperCase() : true ).forEach((e) => {
            const pNome = document.createElement('p');
            pNome.slot = 'nome';
            pNome.innerHTML = e.nome;
            
            const pTelefone = document.createElement('p');
            pTelefone.slot = 'telefone';
            pTelefone.innerHTML = e.telefone;
            
            const pEndereco = document.createElement('p');
            pEndereco.slot = 'endereco';
            pEndereco.innerHTML = e.endereco;
            
            const pCidade = document.createElement('p');
            pCidade.slot = 'cidade';
            pCidade.innerHTML = e.cidade;
            
            const pUf = document.createElement('p');
            pUf.slot = 'uf';
            pUf.innerHTML = e.uf;
            
            const botaoInfo = document.createElement('input');
            botaoInfo.type = 'button';
            botaoInfo.addEventListener('click', ocultarDesocultarInfo);
    
            botaoInfo.style = 'border: none; margin-left: 10px;';
            botaoInfo.slot = 'botaoInfo';
            botaoInfo.value = '-';
    
            const contatoCard = document.createElement('contato-card');
            contatoCard.appendChild(pNome);
            contatoCard.appendChild(pTelefone);
            contatoCard.appendChild(pEndereco);
            contatoCard.appendChild(pCidade);
            contatoCard.appendChild(pUf);
            contatoCard.appendChild(botaoInfo);
        
            divLista.appendChild(contatoCard);
        });

        if(this.shadowRoot.childElementCount > 0){
            this.shadowRoot.removeChild(this.shadowRoot.childNodes.item(0));
        }

        this.shadowRoot.appendChild(divLista);
    }

    static get observedAttributes(){
        return ["ufpesquisa"];
    }

    // vai executar quando for altererado a propriedade monitorada - ufpesquisa, se quiser monitorar mais tem que setar no observedAttributes
    attributeChangedCallback(name, oldValue, newValue){
        console.log(`atributo: ${name}, valor antio: ${oldValue}, novo valor: ${newValue}`)
        if(name === 'ufpesquisa'){
            console.log('entrou gerar contatos');
            this.gerarListaContatos();
        }
    }

    // vai roar quando o elemento for adicionado ao dom !!!!!!!! nao deu certo
    //connectedCallback() {
        //this.gerarListaContatos();
    //}
}

class ContatoCard extends HTMLElement{
    constructor(){
        super();
        if(!this.shadowRoot){
            this.attachShadow({mode: 'open'})
        }
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .card-contato {
                    margin: 5px;
                    padding: 5px;
                    border-radius: 5px;
                    width: 200px;
                    text-align: center;
                    font-size: small;
                }

                .legenda-fieldset {
                    display:flex;
                    align-items: center;
                }

                p {
                    font-size: small;
                }
            </style>

            <fieldset class="card-contato">
                <legend class="legenda-fieldset">
                    <slot name="nome"></slot>
                    <slot name="botaoInfo"></slot>
                </legend>
                
                <slot name="telefone"></slot>
                <slot name="endereco"></slot>
                <slot name="ciddade"></slot>
                <slot name="uf"></slot>
            </fieldset>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

class Busca extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'})

        const textoUf = document.createElement('input');
        textoUf.id = 'texto-uf';
        textoUf.type = 'text';
        textoUf.placeholder = 'pesquisar ufs aqui';
        textoUf.maxLength = 2;
        
        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = 'buscar';
        btn.addEventListener('click', () => {
            const listaContatos = document.querySelector('lista-contatos');
            const valorTexto = textoUf.value;

            if(listaContatos){
                listaContatos.setAttribute('ufpesquisa', valorTexto);
            }
        });

        const div = document.createElement('div');
        div.className = 'div-busca';
        div.style = `
            display: flex;
            justify-content: center;
        `;

        div.appendChild(textoUf);
        div.appendChild(btn);

        this.shadowRoot.appendChild(div);
    }
}

customElements.define('contato-card', ContatoCard);
customElements.define('lista-contatos', ListaContatos);
customElements.define('barra-busca', Busca);

// metodos ----

function ocultarDesocultarInfo(input){
    let slots = input.target.parentElement.children;
    let botao = input.target;
    let visivel = false;

    if(slots){
        for (let i = 0; i < slots.length; i++) {
            if(slots[i] !== botao && slots[i].slot !== 'nome'){
                visivel = slots[i].getAttribute('hidden')?? false;

                if(visivel){
                    slots[i].removeAttribute('hidden');
                }
                else{
                    slots[i].setAttribute('hidden', true)
                }
            }
            else{
                botao.value = visivel ? '-' : '+';
            }
        }
    }
}

// registrar o serviceWorker

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("./serviceWorker.js")
        .then(res => console.log("service worker registrado"))
        .catch(err => console.log("service worker não registrado", err))
    })
  }