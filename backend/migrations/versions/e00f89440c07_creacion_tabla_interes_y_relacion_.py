"""Creacion tabla Interes y relacion Usuario-Direccion_Entrega

Revision ID: e00f89440c07
Revises: e006f68abda3
Create Date: 2024-10-16 17:26:35.314872

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'e00f89440c07'
down_revision = 'e006f68abda3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('direccion_entrega', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_usuario', sa.Integer(), nullable=False))
        batch_op.alter_column('telefono',
               existing_type=mysql.INTEGER(display_width=11),
               type_=sa.String(length=30),
               existing_nullable=False)
        batch_op.create_foreign_key(None, 'usuario', ['id_usuario'], ['id_usuario'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('direccion_entrega', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('telefono',
               existing_type=sa.String(length=30),
               type_=mysql.INTEGER(display_width=11),
               existing_nullable=False)
        batch_op.drop_column('id_usuario')

    # ### end Alembic commands ###
