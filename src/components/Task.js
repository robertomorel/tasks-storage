import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import commonStyles from '../commonStyles'
import Swipeable from 'react-native-swipeable'

/*

    Task será um componente funcional, que não tem estado
    Vai receber como parâmetro também algumas funções, que quando chamadas,
    notificam a agenda.

*/

export default props => {

    // -- Para verificar se a tarefa foi concluída 
    let check = null;

    // -- Se a tarefa já foi concluída (props.doneAt)
    if (props.doneAt !== null) {

        // -- A variável check retornará um pequeno componente que desenhará um ícone
        check = (
            <View style={styles.done}>
                <Icon name='check' size={20} /* Cria um novo ícone */
                    color={commonStyles.colors.secondary} />
            </View>
        )

    } else {
        // -- Senão, cria uma view com um efeito visual de pendente (circulo vazio)
        check = <View style={styles.pending} />
    }

    // -- Cria um estilo para que o texto fique cortado caso a tarefa esteja concluída
    // -- Se a data de conclusão for diferente de nulo
    const descStyle = props.doneAt !== null ?
        // -- Cria uma linha cortando o texto
        { textDecorationLine: 'line-through' } : {}


    // -- Cria um content com uma view que possui um ícone de lixeira e o label "Excluir"
    // -- Ficará à esquerda
    const leftContent = (
        <View style={styles.exclude}>
            <Icon name='trash' size={20} color='#FFF' />
            <Text style={styles.excludeText}>Excluir</Text>
        </View>
    )

    // -- Cria um content array (com um só elemento) clicável que chama o método onDelete, 
    //    passado por parâmetro quando pressionado
    // -- () => props.onDelete(props.id) -> chama o onDelete passando o id da tarefa
    // -- Ficará à direita
    const rightContent = [
        <TouchableOpacity
            style={[styles.exclude, { justifyContent: 'flex-start', paddingLeft: 20 }]}
            onPress={() => props.onDelete(props.id)}>
            <Icon name='trash' size={30} color='#FFF' />
        </TouchableOpacity>,
    ]

    return (

        /*
            A tag Swipeable realiza uma ação de deslizar.
            leftActionActivationDistance = Distância necessária para ativar a ação do Swipeable - da esquerda p direita
            onLeftActionActivate = quando o evento for disparado (esq p dir), chamamos a função "() => props.onDelete(props.id)"
            leftContent = conteúdo que aparece na esquerda
            rightButtons = botões que aparecem na direita (quando deslizado da direita para a esquerda)
        */

        <Swipeable
            leftActionActivationDistance={200}
            onLeftActionActivate={() => props.onDelete(props.id)}
            leftContent={leftContent} rightButtons={rightContent}>

            <View style={styles.container}>

                <TouchableWithoutFeedback
                    // -- Qndo clicado, vai chamar e executar a função 'toggleTask' do 'Agenda'
                    onPress={() => props.onToggleTask(props.id)}>
                    {/* Cria o estilo para representar se tarefa está finalizada, ou não */}
                    <View style={styles.checkContainer}>{check}</View>
                </TouchableWithoutFeedback>

                {/* Cria o texto referente à tarefa e sua data estimada para finalização */}
                <View>
                    <Text style={[styles.description, descStyle]}>
                        {props.desc}
                    </Text>

                    <Text style={styles.date}>
                        {moment(props.estimateAt /*Data estimada para o fim da tarefe*/).locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')}
                    </Text>

                </View>

            </View>

        </Swipeable>

    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#AAA',
    },
    checkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
    },
    pending: {
        borderWidth: 1,
        height: 25,
        width: 25,
        borderRadius: 15,
        borderColor: '#555',
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 15,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center',
    },
    description: {
        //fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15,
    },
    date: {
        //fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12,
    },
    exclude: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    excludeText: {
        //fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10,
    }
})