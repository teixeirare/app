const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo";

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch (errro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input ({ message: "Digite a meta:"}) 

    if(meta.length == 0) {
        mensagem = 'a meta não pode estar vazia.'
        return
    }

    metas.push(
        { value: meta, checked: false }
    
    )

    mensagem = "Metas cadastradas com sucesso!"
}

const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas"
        return
    }

    const respostas = await checkbox ({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false, 
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.lenght == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    
    respostas.forEach ((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true 
    })

    mensagem = 'Meta(s) marcada(s) como concluída(s)'
}

const metasRealizadas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked 
    })

    if(realizadas.lenght == 0) {
        mensagem = 'Não existe metas realizadas!'
        return
    }

    await select({
        message: "Metas realizadas: " + realizadas.lenght,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas"
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.lenght == 0) {
        mensagem = "Não existe metas abertas!"
        return
    }

    await select ({
        message: "Metas abertas: " + abertas.lenght,
        choices: [...abertas]
    })
    
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas"
        return
    }

    const metasDesmarcadas = metas.map((mata) => {
        return { value: metas.value, checked: false }
    })

    const itemsADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemsADeletar.lenght == 0) {
        mensagem = "Nenhum item para deletar"
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item 
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()

    while (true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select ({
            message: "Menu >",
            choices: [
                {
                    name: "cadastrar metas",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })


        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta ()
                break 
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break 
                case "deletar":
                await deletarMetas()
                break    
            case "sair":
                console.log("até a proxima")
                return
        }
    }
}

start ()