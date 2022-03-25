class Calculator extends React.Component{
    //Component to handle interaction between the display and the body

    constructor(props){
        super(props);
        this.state={line:'',result:0};
        this.handleOutputChange=this.handleOutputChange.bind(this);
    }
    
    handleOutputChange(outputLine,outputResult=this.state.result){
        this.setState({line:outputLine,result:outputResult});
    }
    render(){
        return(
            <div>
                <section>
                    <Display line={this.state.line} result={this.state.result}/>
                </section>

                <section>
                    <CalcBody onChange={this.handleOutputChange}/>
                </section>
            </div>
        )
    }
}

class Display extends React.Component{
    //component to display the calculation and result
    constructor(props){
        super(props);
        this.line=props.line;
        this.result=props.result;
    }
    render(){
        return(
            <text>{this.line+(this.line ? " = " : '')+this.result}</text>
        );
    }
}

class CalcBody extends React.Component{
    //component for the calculator buttons and calculations
    constructor(props){
        super(props);
        this.changeOutput=props.onChange;
        this.handleCalculation=this.handleCalculation.bind(this);
        this.line=[];
    }
    buttonClick(value){
        //update current line and check if calculation is needed. also update the UI.
        //remember to use target.value
    }
    handleCalculation(line){
        //use the line the user has entered and calculate it using calculation functions, then call the changeOutput func
    }
    //calculation functions below this line
    
    render(){
        return (<Buttons onClick={this.buttonClick}/>);
    }
}
function Button(props){
    return(
        <button key={props.value} onClick={props.click}>{props.value}</button>
    );
}

class Buttons extends React.Component{
    //
    constructor(props){
        super(props);
        this.updateClick=props.onClick;
    }

    render(){

        return(
            <div>
                <Button click={this.updateClick} value= "1"/>
                <Button click={this.updateClick} value= "2"/>
                <Button click={this.updateClick} value= "3"/>
                <Button click={this.updateClick} value= "4"/>
                <Button click={this.updateClick} value= "5"/>
                <Button click={this.updateClick} value= "6"/>
                <Button click={this.updateClick} value= "7"/>
                <Button click={this.updateClick} value= "8"/>
                <Button click={this.updateClick} value= "9"/>
                <Button click={this.updateClick} value= "0"/>
                <Button click={this.updateClick} value= "+"/>
                <Button click={this.updateClick} value= "-"/>
                <Button click={this.updateClick} value= "x"/>
                <Button click={this.updateClick} value= "/"/>
                <Button click={this.updateClick} value= "^"/>
                <Button click={this.updateClick} value= "%"/>
                <Button click={this.updateClick} value= "C"/>
                <Button click={this.updateClick} value= "DEL"/>
                <Button click={this.updateClick} value= "("/>
                <Button click={this.updateClick} value= ")"/>
            </div>
        );
    }

}

function start(){
    //function triggers the rendering of the calculator
    const root=document.getElementById('root');
    const element=<Calculator/>;
    ReactDOM.render(element,root);
}
start();