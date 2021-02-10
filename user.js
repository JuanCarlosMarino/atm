class User{
    constructor(account, password, balance){
        this.account = account;
        this.password = password;
        this.balance = balance;
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