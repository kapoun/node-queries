import * as mysql        from 'mysql2';
import IEnhancedResponse from '../../interfaces/enhanced-response';
import AbstractBuilder   from './abstract';

export default class DeleteBuilder extends AbstractBuilder {
  
  public constructor(connection: mysql.Connection, table: string) {
    let statement = mysql.format(
      'DELETE FROM ??',
      [ table ]
    );
    super(connection, statement, table);
  }

  protected where(criteria: any): this {
    return this.createWhereStatement(criteria);
  }
  
  public checkPermission(column: string, value: any): this {
    return this.addSimpleCheck(column, value);
  }
  
  public checkPermissionWithJoin(joinedTable: string, using: string, column: string, value: any): this {
    return this.addJoinedCheck(joinedTable, using, column, value);
  }
  
  public checkPermissionElsewhere(table: string, keyColumn: string, keyValue: any, column: string, value: any): this {
    return this.addForeignCheck(table, keyColumn, keyValue, column, value);
  }
  
  protected returnResponse(response: IEnhancedResponse, result: any): void {
    response.noContent();
  }
  
}
