import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

class ExpensePredictor:
    def __init__(self):
        self.model = LinearRegression()
        
    def train_and_predict(self, data):
        """
        Expects a list of dicts with 'date' and 'amount'
        """
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df['day_number'] = (df['date'] - df['date'].min()).dt.days
        
        X = df[['day_number']]
        y = df['amount']
        
        self.model.fit(X, y)
        
        next_day = df['day_number'].max() + 30
        prediction = self.model.predict([[next_day]])
        return max(0, prediction[0])

# Sample data structure for backend usage
if __name__ == "__main__":
    sample_expenses = [
        {'date': '2024-01-01', 'amount': 250},
        {'date': '2024-01-10', 'amount': 150},
        {'date': '2024-02-01', 'amount': 300},
        {'date': '2024-02-15', 'amount': 100},
    ]
    predictor = ExpensePredictor()
    print(f"Predicted expense for next month: ${predictor.train_and_predict(sample_expenses):.2f}")
