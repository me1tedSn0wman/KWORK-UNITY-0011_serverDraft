#GET DATA FROM GOOGLE TABLE and put it ni MySQL table

import numpy as np
import gspread
import math 
import pandas as pd
from gspread_dataframe import get_as_dataframe, set_with_dataframe
from threading import Thread
from time import sleep

from getpass import getpass
import mysql.connector as myCon

def main_ff():
	print("Starting...")

	print("Try Connect To Google SpreadSheet")
	gc = gspread.service_account(filename="/home/tyukidama/python_bots/kwork-0011/credentials_parse.json")
	spreadSheet = gc.open_by_key("1XIDT8M79gEZx3gFbSqNcgJxFrlvfq3zkg7Hhzknc3nU")
    
	steamIDSheet = spreadSheet.get_worksheet(0)

	df_questions: DataFrame = get_as_dataframe(steamIDSheet, dtype=str)
    
	print("Try connect to MySQL DataBase")
	

	cnx = myCon.connect(
		host="localhost",
		user="snow",
		port='3306',
		database="duelofanswer"
		)

	insert_query = """
		INSERT INTO questions(
			QUESTION_NUM,
			QUESTION,
			ANSWER_ONE,
			ANSWER_TWO
			)
		VALUES (%s, %s, %s, %s)
	"""


	truncate_table = """
		TRUNCATE questions
	"""
	
	cursMySQL = cnx.cursor()
	print(cursMySQL)

	cursMySQL.execute(truncate_table)
	cnx.commit()

	for i in range(0, len(df_questions.index)):

		data = (
			i, 
			df_questions.iloc[i]["Questions"],
			df_questions.iloc[i]["Answer 1"],
			df_questions.iloc[i]["Answer 2"]
			)
		cursMySQL.execute(insert_query, data)
		cnx.commit()
		print("insert data ",i," from ",len(df_questions.index))
	print(cursMySQL)

	cnx.close()

main_ff()
