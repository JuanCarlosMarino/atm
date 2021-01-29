class User{
    constructor(account, password, balance){
        this.account = 042635212;
        this.password = 123456;
        this.balance = 50000;
    }
    auth(account, password){
        return account === this.account && password === this.password;
    }
    withdraw(amount){
        if(this.auth() && amount < this.balance && (amount%10) === 0){
            balance -= amount
            return true;
        }else{
            return false;
        }
    }
    checkBalance(){
        if(this.auth()){
            return this.balance;
        }else{
            return false;
        }
    }
    consign(amount){
        if(this.auth()){
            this.balance += amount;
            return true;
        }else{
            return false;
        }
    }
}