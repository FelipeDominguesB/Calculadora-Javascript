class CalcController{

    constructor(){

        this._audio = new Audio('click.mp3');
        this.audioOnOff = false;
        this.lastOperator = '';
        this.lastNumber ='';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        this._operation = [];

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    copyToClipboard()
    {
        let input = document.createElement('input');
        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    pasteFromClipboard()
    {
        document.addEventListener('paste', e => {
            let texto = e.clipboardData.getData('Text');

            if(parseFloat(texto) != NaN)
            {
                this.displayCalc = texto;
                this.addOperation(parseFloat(texto));
            }
        });
    }

    initialize()
    {
        this.setDisplayDateTime();
        let interval = setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();

        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(element => {
           element.addEventListener('dblclick', e=>{
                this.toggleAudio();
           }); 
        });
    }

    toggleAudio()
    {
        this.audioOnOff  = !this.audioOnOff;
    }

    playAudio()
    {
        if(this.audioOnOff)
        {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard()
    {
        document.addEventListener('keyup', e =>{
            this.playAudio();
        
            switch(e.key)
            {
            case 'Escape':
                this.clearAll();
                break;
            
            case 'Backspace':
                this.clearEntry();
                break;
            
            case '+':
            case '-': 
            case '/':    
            case '*':
            case '%':
                this.addOperation(e.key);
                break;

            case 'Enter':
                this.calc();
                break;

            case '.':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseFloat(e.key));
                break;
            
            case 'c':
            case 'C':
                if(e.ctrlKey) this.copyToClipboard();
                break;
            
        }
        });
    }

    initButtonsEvents()
    {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((element, index, array) => {
            
            this.addEventListenerAll(element, 'click drag', () => {
                this.execBtn(element.className.baseVal.replace('btn-', ''));
            });

            this.addEventListenerAll(element, "mouseover mouseup mousedown", () => {
                element.style.cursor = 'pointer' ;
            })
        });
        
    }

    execBtn(valueBtn)
    {
        this.playAudio();
        switch(valueBtn)
        {
            case 'ac':
                this.clearAll();
                break;
            
            case 'ce':
                this.clearEntry();
                break;
            
            case 'soma':
                this.addOperation('+');
                break;
            
            case 'subtracao':
                this.addOperation('-');
                break;
            
            case 'divisao':
                this.addOperation('/');
                break;
            
            case 'multiplicacao':
                this.addOperation('*');
                break;
            
            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseFloat(valueBtn));
                break;
            
            default:
                this.setError();
                break;
        }
    }

    addDot()
    {
        let lastOperation = this.getLastOperation();


        if(this.getLastOperation().toString().includes('.')){
            
        }
        else
        {
            if(this.isOperator(lastOperation) || !lastOperation)
            {
                this.pushOperation('0.');
            }
            else{
                this.setLastOperation(lastOperation.toString() + '.');
            }
        }
        this.setLastNumberToDisplay();
    }

    clearAll()
    {
        this._operation = [];
        this.lastNumber = '';
        this.lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry()
    {
        if(this._operation.length > 0)
        {
            this._operation.pop();
            this.setLastNumberToDisplay();
        }
    }

    setLastOperation(value)
    {
        this._operation[this._operation.length - 1] = value;
    }

    pushOperation(value)
    {
        this._operation.push(value);
        if(this._operation.length > 3)
        {
            this.calc();
        }
    }

    getResult()
    {
        try{
            return eval(this._operation.join(''));  
        }
        catch(e){
            console.log(e)
            this.setError();       
        }
    }

    calc()
    {

        let last = '';

        this.lastOperator = this.getLastItem();

        if(this._operation.length<3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this.lastOperator, this.lastNumber];
        }

        if(this._operation.length > 3)
        {
            let last = this._operation.pop();
            this.lastNumber = this.getResult();  

        }else if(this._operation.length == 3)
        {
            this.lastNumber = this.getLastItem(false);  
        }

        

        let calculo = this.getResult();  

        if(last == '%')
        {
            calculo /= 100;
            this._operation = [calculo];
        }
        else{
            
            
            this._operation = [calculo];
            if(last) this._operation.push(last);
        }
        
        this.setLastNumberToDisplay();

    }

    addOperation(value)
    {
        
        
        if(isNaN(this.getLastOperation()))
        {
            if(this.isOperator(value))
            {
                this.pushOperation(0);
                this.setLastOperation(value);
            }
            else if(isNaN(value))
            {

            }
            else{
                
                this.pushOperation(value.toString()); 
                this.setLastNumberToDisplay();
            }
            
        }
        else
        {
            if(this.isOperator(value))
            {
                this.pushOperation(value); 
            }
            else{

           
                let newValue = this.getLastOperation().toString() + value.toString();  
                this.setLastOperation(newValue);

                //atualizar display
                this.setLastNumberToDisplay();
            }
        }
        
        
    }

    getLastItem(isOperator = true)
    {
        let lastItem;

        
        for(let i = this._operation.length-1;  i>=0; i--)
        {
            
            
            if(this.isOperator(this._operation[i]) == isOperator)
            {
                lastItem = this._operation[i];
                break;
            }
           
        }

        if(!lastItem)
        {
            lastItem = (isOperator) ? this.lastOperator : this.lastNumber;
        }
        return lastItem;

    }
    
    setLastNumberToDisplay()
    {
        let lastNumber = this.getLastItem(false);


        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    isOperator(value)
    {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    }
    getLastOperation(value)
    {
        return this._operation[this._operation.length - 1];
    }
    
    setError()
    {
        

        setTimeout(() => {
            this._operation = [];
            this.displayCalc = "ERROR";;
        }, 1000);
        
        
    }
    

    addEventListenerAll(element, events, func)
    {       
        events.split(' ').forEach((event, index, array) => {
            element.addEventListener(event, func, false);

             
        });
    }

    

    setDisplayDateTime()
    {
        let time = new Date();
        this.displayTime = time.toLocaleTimeString(); 
        this.displayDate = time.toLocaleDateString();
    }

    get displayTime()
    {
        return this._timeEl.innerHTML;
    }
    
    set displayTime(value)
    {
        return this._timeEl.innerHTML = value;
    }

    get displayDate()
    {
        return this._dateEl.innerHTML;
    }

    set displayDate(value)
    {
        return this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(valor_Display){

        if(valor_Display.toString().length >10)
        {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = valor_Display;
    }

    get CurrentDate()
    {
        return new Date();
    }

    set CurrentDate(valor_Data)
    {
        this._currentDate = valor_Data;
    }
}