# FOR UPDATE STATS

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
    
	print("Try connect to MySQL DataBase")

	cnx = myCon.connect(
		host="localhost",
		user="snow",
		port='3306',
		database="duelofanswer"
		)

	
	cursMySQL = cnx.cursor()
	print(cursMySQL)

	truncate_table = """
		DROP TABLE IF EXISTS responces_stats
	"""
	cursMySQL.execute(truncate_table)
	cnx.commit()

	recreate_table = """
		CREATE TABLE responces_stats AS 
			SELECT 
				quest.QUESTION_NUM,
				COUNT(resp.RESPONSE_ID) as STAT_SUM
			FROM questions as quest
			LEFT JOIN responses as resp
			ON (1=1
				AND quest.QUESTION_NUM = resp.QUESTION_NUM
				)			
			GROUP BY
				quest.QUESTION_NUM
	"""

	cursMySQL.execute(recreate_table)
	cnx.commit()

	cnx.close()

main_ff()
