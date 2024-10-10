"""inicio

Revision ID: a3c05348c568
Revises: 
Create Date: 2024-10-04 20:32:28.280080

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a3c05348c568'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Usuario',
    sa.Column('id_usuario', sa.Integer(), nullable=False),
    sa.Column('nombre_usuario', sa.String(length=80), nullable=False),
    sa.Column('correo_electronico', sa.String(length=100), nullable=False),
    sa.Column('numero_telefono', sa.String(length=13), nullable=False),
    sa.Column('contrasenia', sa.String(length=50), nullable=False),
    sa.Column('fecha_creacion', sa.DateTime(), nullable=True),
    sa.Column('ultimo_login', sa.DateTime(), nullable=True),
    sa.Column('estado_usuario', sa.String(length=15), nullable=True),
    sa.Column('zona_trabajo', sa.String(length=50), nullable=True),
    sa.Column('imagen_perfil', sa.LargeBinary(), nullable=True),
    sa.PrimaryKeyConstraint('id_usuario'),
    sa.UniqueConstraint('contrasenia'),
    sa.UniqueConstraint('correo_electronico'),
    sa.UniqueConstraint('numero_telefono')
    )
    op.create_table('foto',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('filename', sa.String(length=100), nullable=False),
    sa.Column('data', sa.LargeBinary(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('foto')
    op.drop_table('Usuario')
    # ### end Alembic commands ###
