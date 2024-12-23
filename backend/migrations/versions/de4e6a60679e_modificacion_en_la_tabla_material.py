"""Modificacion en la tabla material

Revision ID: de4e6a60679e
Revises: 333f63c9ff55
Create Date: 2024-10-23 23:52:29.742691

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'de4e6a60679e'
down_revision = '333f63c9ff55'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('material', schema=None) as batch_op:
        batch_op.add_column(sa.Column('latitud_publicacion_material', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('longitud_publicacion_material', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('descripcion_direccion_material', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('estado_publicacion_material', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('material', schema=None) as batch_op:
        batch_op.drop_column('estado_publicacion_material')
        batch_op.drop_column('descripcion_direccion_material')
        batch_op.drop_column('longitud_publicacion_material')
        batch_op.drop_column('latitud_publicacion_material')

    # ### end Alembic commands ###
