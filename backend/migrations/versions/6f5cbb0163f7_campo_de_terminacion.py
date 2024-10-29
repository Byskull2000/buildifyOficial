"""Campo de terminacion

Revision ID: 6f5cbb0163f7
Revises: cfa3155af19d
Create Date: 2024-10-28 23:00:45.768852

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6f5cbb0163f7'
down_revision = 'cfa3155af19d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('material', schema=None) as batch_op:
        batch_op.add_column(sa.Column('fecha_terminacion', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('material', schema=None) as batch_op:
        batch_op.drop_column('fecha_terminacion')

    # ### end Alembic commands ###
