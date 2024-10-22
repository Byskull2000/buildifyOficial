"""
Creación de tabla material con relaciones a usuario y tipo_material

Revision ID: cb88e06441d9
Revises: 04748e94e2c3
Create Date: 2024-10-22 09:11:48.034231

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'cb88e06441d9'
down_revision = '04748e94e2c3'
branch_labels = None
depends_on = None


def upgrade():
    # Crear la tabla 'material' con relaciones a 'usuario' y 'tipo_material'
    op.create_table('material',
        sa.Column('id_material', sa.Integer(), nullable=False),
        sa.Column('nombre_material', sa.String(length=100), nullable=False),
        sa.Column('cantidad_material', sa.Integer(), nullable=False),
        sa.Column('estado_material', sa.String(length=20), nullable=False),
        sa.Column('precio_material', sa.String(length=30), nullable=False),
        sa.Column('descripcion_material', sa.String(length=255), nullable=True),
        sa.Column('id_usuario', sa.Integer(), nullable=False),
        sa.Column('id_tipoMaterial', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['id_tipoMaterial'], ['Tipo_Material.id_tipoMaterial'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['id_usuario'], ['usuario.id_usuario'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id_material')
    )

    # No se recrean las tablas 'Tipo_Material' ni 'Interes'
    # ### end Alembic commands ###


def downgrade():
    # Eliminar la tabla 'material' en caso de un downgrade
    op.drop_table('material')

    # No se recrean las tablas 'Tipo_Material' ni 'Interes'
    # ### end Alembic commands ###
