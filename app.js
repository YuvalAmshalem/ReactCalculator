class Calculator extends React.Component{
    //Component to handle interaction between the display and the body

    constructor(props){
        super(props);
        this.state={line:''};
        this.handleOutputChange=this.handleOutputChange.bind(this);
    }
    
    handleOutputChange(outputLine){
        this.setState({line:outputLine});
    }
    render(){
        return(
            <div>
                <section>
                    <Display line={this.state.line}/>
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
        this.calculateResult=this.calculateResult.bind(this);
        this.handleInput=this.handleInput.bind(this);
    }


    calculateResult(tempLine){
        console.log("Entering function with line= "+tempLine);
        let firstBracket;
        const count = {};
        let lastBracket;
        for (const element of tempLine) {
            if (count[element]) {
                count[element] += 1;
            } else {
                count[element] = 1;
            }
        }

        if(count['(']!==count[')']){ //check for opening and closing brackets
            return " ";
        }
        let result;

        //Bracket part:
        let currentIndex=null;
        while(currentIndex!==-1){
            currentIndex=tempLine.indexOf('(');
            firstBracket=currentIndex;
            let openBrackets=0;
            for(let x=currentIndex+1;x<tempLine.length;x++){
                if(tempLine[x]=== '(' ){
                    openBrackets++;
                } else if(tempLine[x]=== ')'){
                    if(openBrackets===0){
                        //this is the inside, use recursion and modify
                        lastBracket=x;
                        console.log("first bracket: "+firstBracket+" last bracket: "+lastBracket);//temp line is always the same
                        console.log(tempLine);
                        console.log("Sliced Line To Solve: "+tempLine.slice(firstBracket+1,lastBracket));
                        console.log("splice from "+tempLine[firstBracket]+" To "+tempLine[lastBracket]+" Last index="+lastBracket);//shows undefined. log the index too.
                        let sliced=tempLine.slice(firstBracket+1,lastBracket);
                        result=this.calculateResult(sliced);
                        console.log(result);
                        tempLine.splice(firstBracket,lastBracket+1-firstBracket, ...result); //make sure no tweaking is needed with numbers 
                        break;
                    } else{
                        openBrackets--;
                    }
                }
            }
            
        }
        return this.solve(tempLine);
    }
        //action part:
    solve(lineToSolve){
        console.log("solving - "+lineToSolve);
        const namesToFuncs={"^":this.powFunc,"%":this.percentFunc,"x":this.mulFunc,"/":this.divFunc,"+":this.addFunc,"-":this.subFunc};
        let currentIndex;
        let firstIndex;
        let secondIndex;
        let x;
        for(let actionPair of [['^','%'],['x','/'],['+','-']]){
            firstIndex=lineToSolve.indexOf(actionPair[0]);
            secondIndex=lineToSolve.indexOf(actionPair[1]);
            currentIndex= firstIndex>secondIndex ? firstIndex : secondIndex;
            if (currentIndex===lineToSolve.length-1){ //if equation is illegal
                return " ";
            }
            while(currentIndex!==-1){ //while the highest ordered action still exists in line:
                x=lineToSolve[currentIndex];
                lineToSolve.splice(currentIndex-1,3, namesToFuncs[x](lineToSolve[currentIndex-1],lineToSolve[currentIndex+1]))
                firstIndex=lineToSolve.indexOf(actionPair[0]);
                secondIndex=lineToSolve.indexOf(actionPair[1]);
                currentIndex= firstIndex>secondIndex ? firstIndex : secondIndex;
            }
        }
        console.log("="+lineToSolve);
        return lineToSolve; 

    }
    powFunc(first,second){
        return (parseFloat(first)**parseFloat(second)).toString();
    }
    percentFunc(first,second){
        return ((parseFloat(second)/parseFloat(first))*100).toString();
    }
    mulFunc(first,second){
        return (parseFloat(first)*parseFloat(second)).toString();
    }
    divFunc(first,second){
        return (parseFloat(first)/parseFloat(second)).toString();
    }
    addFunc(first,second){
        return (parseFloat(first)+parseFloat(second)).toString();
    }
    subFunc(first,second){
        return (parseFloat(first)-parseFloat(second)).toString();
    }
    
    handleInput(e){
        console.log("handle input: event is "+e);
        this.line=e.target.value.split();
    }
    //make input work with keyboard too.

    toFixed(value, precision) {
        var power = Math.pow(10, precision || 0);
        return String(Math.round(value * power) / power);
    }

    render(){
        this.line=this.props.line;// may be problematic with the input thingy 
        console.log("rendering display- line is: "+this.line);
        let strRepr='';
        for(let x of this.line){
            strRepr+=x+" "
        }
        return(
            <div>
                <input type="text" value={strRepr} onChange={e=>this.handleInput(e)}></input>
                <text>{(this.line ? " = " : '')+this.toFixed(this.calculateResult(JSON.parse(JSON.stringify(this.line))),5)}</text>
            </div>
        );
    }
}

class CalcBody extends React.Component{
    //component for the calculator buttons and calculations
    constructor(props){
        super(props);
        this.changeOutput=props.onChange;
        this.buttonClick=this.buttonClick.bind(this);
        this.line=[];
        this.afterDecimal=null;
    }
    buttonClick(event){ 
        //update current line and check if calculation is needed. also update the UI.

        if(!isNaN(event.target.value)){ //if input is a number
            if (!isNaN(this.line[this.line.length-1])){ //if last line element is a number
                let tempLast=parseFloat(this.line.pop());
                if(this.afterDecimal!==null){ //is the last number after a decimal point?
                    this.afterDecimal*=10;
                    this.afterDecimal+=parseInt(event.target.value);
                    let newLast=parseFloat(`${parseInt(tempLast)}.`+this.afterDecimal.toString());//create float using strings
                    this.line.push(newLast.toString()); //push float according to decimal point
                }else{ //just an extension of previous int
                    tempLast*=10;
                    tempLast+=parseInt(event.target.value);
                    this.line.push(tempLast.toString()); //add current number to existing number in the writing
                }
            } else{
                this.line.push(event.target.value); //just insert the number after action/brackets
            }
        } else if(event.target.value==="."){
            if(this.afterDecimal!==null||isNaN(this.line[this.line.length-1])){
                alert("Oops! Illegal click");
                return;
            }
            let tempNumber=this.line.pop();
            this.afterDecimal=0;
            this.line.push((parseFloat(tempNumber)).toString());

        } else{
        switch (event.target.value){
            case('DEL'):
                this.line=[];
                this.afterDecimal=null;
                break;
            case('C'):
                console.log("after decimal: "+this.afterDecimal+" line: "+this.line);
                if(this.afterDecimal<10){   
                    this.afterDecimal=null;
                    let tempLast=this.line.pop();
                    console.log(tempLast);
                    this.line.push(parseInt(tempLast));
                }
                else if(this.afterDecimal!==null){
                    this.afterDecimal/=10;
                    let tempLast=parseInt(this.line.pop());
                    this.line.push((parseFloat(`${parseInt(tempLast)}.`+parseInt(this.afterDecimal).toString())).toString());
                }
                else if(this.line!==[]){
                    this.line.pop();
                }
                break;
            case('('):
                if(this.afterDecimal===0 ){
                    alert("Oops! Illegal click");
                    return;
                }
                this.afterDecimal=null;
                if(this.line[this.line.length-1]=== ')' ){ //bracket to bracket multiplication
                    this.line.push('x');
                    
                }
                this.line.push('(');
                break;
            case(')'):
                let count1=0;
                let count2=0;
                for(let x of this.line){
                    if(x==='('){
                        count1++;
                    } else if(x===')'){
                        count2++;
                    }
                }
                if( count1<=count2 || this.afterDecimal===0 ){
                    alert("Oops! Illegal click");
                    return;
                }
                this.afterDecimal=null;
                this.line.push(')');
                break;
            default://check if last insert was an action- if so, tell the user it's forbidden and don't register it to the line
                if(isNaN(this.line[this.line.length-1])){
                    alert("Oops! Illegal click");
                    return;
                }
                this.afterDecimal=null;
                this.line.push(event.target.value);
        } }
        this.changeOutput(this.line);
    }
    
    render(){
        return (<Buttons onClick={this.buttonClick}/>);
    }
}
function Button(props){
    return(
        <button key={props.value} value={props.value} onClick={props.click}>{props.value}</button>
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
                <Button click={this.updateClick} value= "."/>
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
