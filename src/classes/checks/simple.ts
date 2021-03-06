import * as mysql             from 'mysql2';
import {Observable, Observer} from 'rxjs';
import ICheck                 from '../../interfaces/check';

export default class SimpleCheck implements ICheck {
  
  private connection:    mysql.Connection;
  private statement:     string;
  private expectedValue: any;
  
  public constructor(connection: mysql.Connection, table: string, column: string, value: any) {
    this.connection = connection;
    this.statement = mysql.format(
      'SELECT ?? AS "value" FROM ??',
      [ column, table ]
    );
    this.expectedValue = value;
  }
  
  public check(whereStatements: string[]): Observable<boolean> {
    let statement = this.statement;    
    if (whereStatements && whereStatements.length > 0)
      statement += ' WHERE ' + whereStatements.join(' AND ');
    
    return Observable.create((observer: Observer<boolean>) => {
      this.connection.query(statement, (error, rows: any[]) => {
        if (error) {
          observer.error(error);
        }
        else if (rows.length > 0) {
          var equals = true;
          for (let row of rows) {
            let value = row['value'];
            if (value !== this.expectedValue) {
              equals = false;
              break;
            }
          }
          observer.next(equals);
        }
        else
          observer.next(null);
        
        observer.complete();
      });
    });
  }
  
}
