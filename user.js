class User{
    constructor(){
        this.account = 42635212;
        this.password = 123456;
        this.balance = 50000;
    }
    auth(account, password){
        return account === this.account && password === this.password;
    }
    withdraw(amount){
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
    consign(amount){
        if(this.auth(account, password)){
            this.balance += amount;
            return true;
        }else{
            return false;
        }
    }
}

module.exports = User;