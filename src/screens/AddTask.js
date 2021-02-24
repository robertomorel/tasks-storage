import React, { Component } from 'react'
import {
    Modal,
    View,
    Text,
    TextInput,
    DatePickerIOS,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
    DatePickerAndroid,
    Platform
} from 'react-native'
import moment from 'moment'
import commonStyles from '../commonStyles'

/*

    Task será um componente com estado, então será baseado em classe
    Será um modal que criará uma janelinha com dois campos: descrição e data estimada da tarefa

*/

const initialState = { desc: '', date: new Date() };

export default class AddTask extends Component {

    /*
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }
    */

    state = { ...this.initialState };

    /*
        Método para settar o estado inicial
    */
    getInitialState = () => {
        return {
            desc: '',
            date: new Date()
        }
    }


    /*
        Método para salvar os dados preenchidos no modal
    */
    save = () => {
        // -- Valida se descrição existe
        if (!this.state.desc.trim()) {
            Alert.alert('Dados inválidos', 'Informe uma descrição para a tarefa')
            return
        }

        // -- Cria uma constante data (dados) que receberá um spread de 'this.state'
        const data = { ...this.state };
        // -- Chama o método "onSave" passado por parâmetro
        this.props.onSave(data);

        this.setState({ ...this.initialState });
    }

    /*
        Método para apresentar um Modal de escolha de data com o DatePicker.
        O Modal será aberto a partir a função open

    */
    handleDateAndroidChanged = () => {
        DatePickerAndroid.open({
            date: this.state.date
        }).then(e => {
            // -- Caso o usuário não cancelou o modal...
            if (e.action !== DatePickerAndroid.dismissedAction) {
                const momentDate = moment(this.state.date);
                // -- Atribui novos valores para o moment
                // -- 'e' é o evento de data escolhido pelo usuário
                momentDate.date(e.day)
                momentDate.month(e.month)
                momentDate.year(e.year)
                // -- Setta o estado com a nova data
                // -- momentDate.toDate() -> transforma a data do moment para uma data pura do react
                this.setState({ date: momentDate.toDate() })
            }
        })
    }

    render() {

        let datePicker = null
        if (Platform.OS === 'ios') {
            datePicker = <DatePickerIOS mode='date' date={this.state.date}
                onDateChange={date => this.setState({ date })} />
        } else {
            // -- Caso seja no Android, criará um campo de texto com a data atual.
            // -- Caso o usuário clique no campo de texto pelo 'TouchableOpacity',
            // -- O método handleDateAndroidChanged será chamado
            datePicker = (
                <TouchableOpacity onPress={this.handleDateAndroidChanged}>
                    <Text style={styles.date}>
                        {moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')}
                    </Text>
                </TouchableOpacity>
            )
        }
    

        return (

            /*
                onRequestClose = Evento chamado quando o modal for fechado
                visible = Habilitação da visibilidade do modal
                animationType = Tipo de animação do modal (mostrar/esconder)
                transparent = Transparente
                onShow = 
            */

            <Modal
                onRequestClose={this.props.onCancel}
                visible={this.props.isVisible}
                animationType='slide'
                transparent={true}
                onShow={() => this.setState({ ...this.getInitialState() })}>

                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    {/*
                        View com um estilo transparente necessária para permitir o click 
                        do usuário para fechar o modal. 
                        O modal não pode ser fechado clicando nele, pois terá inputs.
                    */}
                    <View style={styles.offset}></View>
                </TouchableWithoutFeedback>

                {/*
                    View que será o conteúdo do Modal

                    TextInput
                        placeholder = Texto padrão de exemplo
                        style = Estilo
                        onChangeText = Sempre que o texto alterar, o estado do componente 
                                       deve mudar o 'desc' para atualizar em tela
                        value = Valor do input será o elemento 'desc' do estado
                */}
                <View style={styles.container}>

                    <Text style={styles.header}>Nova Tarefa!</Text>
                    <TextInput
                        placeholder="Descrição..." 
                        style={styles.input} 
                        onChangeText={desc => this.setState({ desc })} 
                        value={this.state.desc} />

                    {datePicker}

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>

                        {/* Botão para cancelar o Modal */}
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>

                        {/* Botão para gravar o Modal */}
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    {/*
                        View com um estilo transparente necessária para permitir o click 
                        do usuário para fechar o modal. 
                        O modal não pode ser fechado clicando nele, pois terá inputs.
                    */}
                    <View style={styles.offset}></View>
                </TouchableWithoutFeedback>

            </Modal>

        )
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    offset: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.default,
    },
    header: {
        //fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.default,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 15,
    },
    input: {
        //fontFamily: commonStyles.fontFamily,
        width: '90%',
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 6
    },
    date: {
        //fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 10,
        textAlign: 'center',
    }
})