import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform,
    AsyncStorage
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br'; // -- Datas formatadas no padrão Brasileiro
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import AddTask from './AddTask';
import { server, showError } from '../common';

import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';

export default class Agenda extends Component {

    state = {
        // -- Array de objetos de propriedades necessárias para a task    
        tasks: [],
        visibleTasks: [],
        showDoneTasks: true,
        showAddTask: false,
    }

    /*
        Método para filtrar as tasks
    */
    filterTasks = () => {
        // -- Cria uma nova variável
        let visibleTasks = null;
        // -- Se o estado atual mandar mostrar todas as tasks finalizadas
        if (this.state.showDoneTasks) {
            // -- O arr visibleTasks receberá um clone das tasks atuais do estado
            visibleTasks = [...this.state.tasks]
            // -- Se o estado atual mandar mostrar apenas as tasks pendentes
        } else {
            // -- Cria uma constante que receberá uma função que verifica se uma determinada task ainda está pendente
            const pending = task => task.doneAt === null
            // -- O arr visibleTasks receberá todas as tasks cujo "task.doneAt === null"
            visibleTasks = this.state.tasks.filter(pending)
        }
        // -- Setta o "visibleTasks" dentro das propriedades do estado (desestruturação)
        this.setState({ visibleTasks })

        /* 
        Já que todos os métodos (toggleFilter, componentDidMount, addTask, deleteTask)
        chamam este método, vamos implementar aqui a persistência no local storage. 
        */
        // -- Transforma o objeto JSON das tasks e transformando numa string
        AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
    }

    /*
        Método para alternar (toggle) o filtro de tasks finalizadas
        O 'setState' é uma função assíncrona, ou seja, existe a possibilidade do 
          'this.filterTasks' ser chamado antes do estado ser modificado.
          Solução: chamar o 'this.filterTasks' no segundo parâmetro do setState.
          Assim, obriga que a função seja chamada apenas depois do estado ser alterado.

    */
    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }
            , this.filterTasks)
    }

    /*
        Método que faz parte do ciclo de vida do react.
        Chamado assim que o componente foi renderizado.
        "componentDidMount" = Componente foi montado
        async -> faz com que algum método/função assíncrona tenha um comportamento
                síncrono dentro de outro contexto
    */
    componentDidMount = async () => {
        // -- Pega as tasks gravadas no storage 
        // -- await é usado para só passar para a próxima linha quando esta execução terminar
        const data = await AsyncStorage.getItem('tasks');

        // -- Transforma a string em JSON
        const tasks = JSON.parse(data) || []; // -- [] caso não exista tasks

        // -- Salva o estado
        this.setState({ tasks }, this.filterTasks);

        // -- Como o setState é assíncrono, primeiro queremos que o estado seja completamente settado.
        //    Por isso o método filterTasks está sendo chamado como callback.
        // -- Também poderia ser "await this.setState()"
        // this.filterTasks();
    }

    addTask = task => {
        // -- Clona o array de tarefas    
        const tasks = [...this.state.tasks];
        tasks.push({
            id: Math.random(),
            desc: task.desc,
            estimateAt: task.date,
            doneAt: null,
        });

        this.setState({ tasks, showAddTask: false /* Esconder o modal */ },
            this.filterTasks);
    }

    deleteTask = async id => {
        const tasks = this.state.tasks.filter((task) => task.id !== id);
        this.setState({ tasks }, this.filterTasks);
    }

    /*

    addTask = async task => {
        try {
            await axios.post(`${server}/tasks`, {
                desc: task.desc,
                estimateAt: task.date
            })

            this.setState({ showAddTask: false }, this.loadTasks)
        } catch (err) {
            showError(err)
        }
    }

    deleteTask = async id => {
        try {
            await axios.delete(`${server}/tasks/${id}`)
            await this.loadTasks()
        } catch (err) {
            showError(err)
        }
    }

    toggleTask = async id => {
        try {
            await axios.put(`${server}/tasks/${id}/toggle`)
            await this.loadTasks()
        } catch (err) {
            showError(err)
        }
    }

    */

    // -- Criando método para marcar como 'done' a tarefa cujo id foi passado,
    //    caos esteja finalizada.
    // Quando chamarmos essa função, o estado vai mudar e, em seguida, a interface tb.
    toggleTask = id => {
        // -- O map gera um novo array semelhante ao original
        const tasks = this.state.tasks.map(
            task => {
                if (task.id === id) {
                    task = { ...task };
                    task.doneAt = task.doneAt ? null : new Date();
                }
                return task;
            }
        );
        this.setState({ tasks }, this.filterTasks /*Necessário chamar esta função para filtrar novamente as tasks*/);
    };

    /*
    Exemplo usanto o 'forEach'
    */
    /*
     toggleTask = id => {
         // -- clona o array tasks do estado atual
         const tasks = [...this.state.tasks];
         // -- Percorre todos os objetos de tasks
         tasks.forEach(task => {
             if (task.id === id) {
                 task.doneAt = task.doneAt ? null : new Date();
             }
         });
         // -- Setta o "tasks" dentro das propriedades do estado (desestruturação)
         this.setState({ tasks });
     };
     */

    render() {

        return (

            <View style={styles.container}>

                <AddTask
                    isVisible={this.state.showAddTask}
                    onSave={this.addTask}
                    onCancel={() => this.setState({ showAddTask: false })} />

                {/* Imprime uma imagem de fundo */}
                <ImageBackground
                    source={todayImage}
                    style={styles.background}>

                    <View style={styles.iconBar}>

                        {/*Ao clicar no ícone (eye/eye-slash), o método toggleFilter será chamado*/}
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash' /*O ícone vai depender da propriedade showDoneTasks do estado*/}
                                size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>

                    </View>

                    {/* Dentro do fundo, cria uma View com textos "Hoje" + data atual formatada */}
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>
                            {moment().locale('pt-br').format('ddd, D [de] MMMM') /*Pega a data atual (moment()) no brasil (locale('pt-br')) e aplica uma formatação 'ddd, D [de] MMMM'*/}
                        </Text>
                    </View>

                </ImageBackground>

                {/* Cria nova view abaixo do cabeçalho para ser o container das tasks */}
                <View style={styles.taksContainer}>

                    <FlatList // -- Para tratar informações de listas que passam do tamanho da tela
                        data={this.state.visibleTasks} // -- Recebe como dados para renderizar as tarefas visíveis
                        keyExtractor={item => `${item.id}`} // -- Sempre que tem array, precisa do atributo key. keyExtrator vai receber uma função que gera o id
                        /*
                        Esta função está passando o item como parâmetro.
                        Cada item representa um objeto da task (this.state.visibleTasks[i]).
                        { item } já é uma desestruturação do array
                        Conteúdo:
                           - Chama a Task, passando as propriedades necessárias de cada tarefa
                               -- Spreading {...item} - Objetos com os atributos id, desc, estimateAt e doneAt
                           - Setta o atribudo toggleTask com o conteúdo da função toggleTask
                        */
                        renderItem={
                            ({ item }) =>
                                <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} />
                        }
                    />

                </View>

                {/* Cria um botão redondo com um + no centro, inserido no canto inferior esquerdo 
                    Ao clicar, o Modal será chamado */}
                <ActionButton buttonColor={commonStyles.colors.today}
                    // -- Quando clicar no botão da action, o modal deve aparecer (showAddTask = true)
                    onPress={() => { this.setState({ showAddTask: true }) }} />

            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        //fontFamily: lato,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        //fontFamily: lato,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    taksContainer: {
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 30,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})