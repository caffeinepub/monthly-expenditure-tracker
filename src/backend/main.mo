import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";

actor {
  type Expense = {
    id : Nat;
    amount : Nat;
    category : Text;
    description : Text;
    date : Time.Time;
    timestamp : Time.Time;
  };

  module Expense {
    public func compare(a : Expense, b : Expense) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type Earning = {
    id : Nat;
    amount : Nat;
    month : Nat;
    year : Nat;
    timestamp : Time.Time;
  };

  let expenses = Map.empty<Nat, Expense>();
  let earnings = Map.empty<Nat, Earning>();

  var nextExpenseId = 0;
  var nextEarningId = 0;

  // Expense Functions
  public shared ({ caller }) func addExpense(amount : Nat, category : Text, description : Text, date : Time.Time) : async Nat {
    let expense : Expense = {
      id = nextExpenseId;
      amount;
      category;
      description;
      date;
      timestamp = Time.now();
    };
    expenses.add(nextExpenseId, expense);
    nextExpenseId += 1;
    expense.id;
  };

  public shared ({ caller }) func updateExpense(id : Nat, amount : Nat, category : Text, description : Text, date : Time.Time) : async () {
    switch (expenses.get(id)) {
      case (null) { Runtime.trap("Expense not found") };
      case (?_) {
        let updatedExpense : Expense = {
          id;
          amount;
          category;
          description;
          date;
          timestamp = Time.now();
        };
        expenses.add(id, updatedExpense);
      };
    };
  };

  public shared ({ caller }) func deleteExpense(id : Nat) : async () {
    if (not expenses.containsKey(id)) {
      Runtime.trap("Expense not found");
    };
    expenses.remove(id);
  };

  public query ({ caller }) func getAllExpenses() : async [Expense] {
    expenses.values().toArray().sort();
  };

  public query ({ caller }) func getExpensesByMonthYear(_month : Nat, _year : Nat) : async [Expense] {
    let filteredExpenses = expenses.values().toArray();
    filteredExpenses; // Needs proper filtering once date parsing is implemented
  };

  // Earnings Functions
  public shared ({ caller }) func setMonthlyEarnings(amount : Nat, month : Nat, year : Nat) : async Nat {
    let earning : Earning = {
      id = nextEarningId;
      amount;
      month;
      year;
      timestamp = Time.now();
    };
    earnings.add(nextEarningId, earning);
    nextEarningId += 1;
    earning.id;
  };

  public query ({ caller }) func getMonthlyEarnings(month : Nat, year : Nat) : async ?Earning {
    let matchingEarnings = earnings.values().toArray().filter(
      func(earning) {
        earning.month == month and earning.year == year
      }
    );
    if (matchingEarnings.size() > 0) {
      ?matchingEarnings[0];
    } else {
      null;
    };
  };

  // Calculation Functions
  public query ({ caller }) func getTotalExpensesByCategory(category : Text, _month : Nat, _year : Nat) : async Nat {
    let filteredExpenses = expenses.values().toArray().filter(
      func(expense) {
        expense.category == category;
      }
    );
    var total = 0;
    for (expense in filteredExpenses.values()) {
      total += expense.amount;
    };
    total;
  };

  public query ({ caller }) func getMonthlySavings(month : Nat, year : Nat) : async Nat {
    var earningsTotal = 0;
    var expensesTotal = 0;

    // Calculate total earnings
    let matchingEarnings = earnings.values().toArray().filter(
      func(earning) {
        earning.month == month and earning.year == year
      }
    );
    for (earning in matchingEarnings.values()) {
      earningsTotal += earning.amount;
    };

    // Calculate total expenses
    let matchingExpenses = expenses.values().toArray();
    for (expense in matchingExpenses.values()) {
      expensesTotal += expense.amount;
    };

    if (earningsTotal >= expensesTotal) {
      earningsTotal - expensesTotal;
    } else {
      0;
    };
  };
};
