"""
Cambio nombre de atributo en foto de id a id_foto, y relacion con usuario

Revision ID: 04748e94e2c3
Revises: e37619dfffd5
Create Date: 2024-10-22 08:00:22.853091

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '04748e94e2c3'
down_revision = 'e37619dfffd5'
branch_labels = None
depends_on = None


def upgrade():
    # Realizar los cambios en la tabla foto
    with op.batch_alter_table('foto', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_foto', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('id_usuario', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(None, 'usuario', ['id_usuario'], ['id_usuario'], ondelete='CASCADE')
        batch_op.drop_column('id')

    # ### Se eliminan las tablas `tipo_material` e `interes` no se recrean ###
    # ### end Alembic commands ###


def downgrade():
    # Revertir los cambios en la tabla foto
    with op.batch_alter_table('foto', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id', mysql.INTEGER(display_width=11), autoincrement=True, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('id_usuario')
        batch_op.drop_column('id_foto')

    # ### Se eliminan las tablas `tipo_material` e `interes` no se recrean ###
    # ### end Alembic commands ###
