"""
Actualizar llave primaria de id_foto a id

Revision ID: 55b2af01d4a5
Revises: cb88e06441d9
Create Date: 2024-10-22 11:59:06.911318

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '55b2af01d4a5'
down_revision = 'cb88e06441d9'
branch_labels = None
depends_on = None


def upgrade():
    # Verificar si la columna id_foto existe antes de eliminarla
    conn = op.get_bind()
    result = conn.execute(sa.text("SHOW COLUMNS FROM foto LIKE 'id_foto';"))
    
    if result.fetchone():
        # Eliminar la columna id_foto si existe
        with op.batch_alter_table('foto', schema=None) as batch_op:
            batch_op.drop_column('id_foto')

    # Verificar si la columna id existe antes de agregarla
    result = conn.execute(sa.text("SHOW COLUMNS FROM foto LIKE 'id';"))
    if result.fetchone() is None:
        # Agregar la columna id si no existe
        with op.batch_alter_table('foto', schema=None) as batch_op:
            batch_op.add_column(sa.Column('id', sa.Integer(), nullable=False))

    # Establecer id como la clave primaria
    op.create_primary_key('pk_foto', 'foto', ['id'])


def downgrade():
    # Eliminar la clave primaria de la columna id
    op.drop_constraint('pk_foto', 'foto', type_='primary')

    # Restaurar id_foto como la clave primaria
    with op.batch_alter_table('foto', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_foto', sa.Integer(), autoincrement=True, nullable=False))

    # Establecer id_foto como la clave primaria nuevamente
    op.create_primary_key('pk_foto', 'foto', ['id_foto'])
