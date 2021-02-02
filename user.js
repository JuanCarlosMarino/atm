class User{
    constructor(){
        this.account = "567890123456";
        this.password = "8520";
        this.balance = 50000;
    }

    //No use los metodos de aca para abajo
    auth(account, password){
        return account === this.account && password === this.password;
    }
    withdrawl(amount){
        if(this.auth(account, password) && amount < this.balance && (amount%10) === 0){
            balance -= amount
            return true;
        }else{
            return false;
        }
    }
    checkBalance(){
        if(this.auth(account, password)){
            return this.balance;
        }else{
            return false;
        }
    }
    deposit(amount){
        if(this.auth(account, password)){
            this.balance += amount;
            return true;
        }else{
            return false;
        }
    }
}

module.exports = User;