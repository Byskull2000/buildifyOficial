"""Eliminar relacion usuario-foto y crear relacion material-foto

Revision ID: bf72ae9277e1
Revises: 55b2af01d4a5
Create Date: 2024-10-22 19:40:46.168769

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'bf72ae9277e1'
down_revision = '55b2af01d4a5'
branch_labels = None
depends_on = None


def upgrade():
    # Comprobar si la tabla 'Tipo_Material' ya existe antes de crearla
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if 'tipo_material' not in inspector.get_table_names():
        op.create_table('Tipo_Material',
            sa.Column('id_tipoMaterial', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('nombre_tipo_material', sa.String(length=50), nullable=False),
            sa.Column('descripcion_tipoMaterial', sa.String(length=255), nullable=True),
            sa.PrimaryKeyConstraint('id_tipoMaterial')
        )

    # Comprobar si la tabla 'Interes' ya existe antes de crearla
    if 'interes' not in inspector.get_table_names():
        op.create_table('Interes',
            sa.Column('id_interes', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('fecha_seleccion', sa.DateTime(), nullable=True),
            sa.Column('id_tipoMaterial', sa.Integer(), nullable=False),
            sa.Column('id_usuario', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['id_tipoMaterial'], ['Tipo_Material.id_tipoMaterial'], ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['id_usuario'], ['usuario.id_usuario'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id_interes')
        )

    # Alterar la tabla 'foto' para eliminar la relación con usuario y agregarla con material
    with op.batch_alter_table('foto', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_material', sa.Integer(), nullable=False))
        batch_op.drop_constraint('foto_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'material', ['id_material'], ['id_material'], ondelete='CASCADE')
        batch_op.drop_column('id_usuario')

    # Alterar la tabla 'material' para la relación con 'Tipo_Material'
    with op.batch_alter_table('material', schema=None) as batch_op:
        batch_op.drop_constraint('material_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'Tipo_Material', ['id_tipoMaterial'], ['id_tipoMaterial'], ondelete='CASCADE')


def downgrade():
    # Deshacer los cambios aplicados en la función upgrade

    # Alterar la tabla 'material' para restaurar la relación con 'Tipo_Material'
    with op.batch_alter_table('material', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('material_ibfk_1', 'tipo_material', ['id_tipoMaterial'], ['id_tipoMaterial'], ondelete='CASCADE')

    # Alterar la tabla 'foto' para restaurar la relación con usuario
    with op.batch_alter_table('foto', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_usuario', mysql.INTEGER(display_width=11), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('foto_ibfk_1', 'usuario', ['id_usuario'], ['id_usuario'], ondelete='CASCADE')
        batch_op.drop_column('id_material')

    # Restaurar las tablas 'Interes' y 'Tipo_Material' eliminadas
    if not op.get_bind().dialect.has_table(op.get_bind(), 'interes'):
        op.create_table('interes',
            sa.Column('id_interes', mysql.INTEGER(display_width=11), autoincrement=True, nullable=False),
            sa.Column('fecha_seleccion', mysql.DATETIME(), nullable=True),
            sa.Column('id_tipoMaterial', mysql.INTEGER(display_width=11), autoincrement=False, nullable=False),
            sa.Column('id_usuario', mysql.INTEGER(display_width=11), autoincrement=False, nullable=False),
            sa.ForeignKeyConstraint(['id_tipoMaterial'], ['tipo_material.id_tipoMaterial'], name='interes_ibfk_1', ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['id_usuario'], ['usuario.id_usuario'], name='interes_ibfk_2', ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id_interes'),
            mysql_collate='utf8mb4_general_ci',
            mysql_default_charset='utf8mb4',
            mysql_engine='InnoDB'
        )

    if not op.get_bind().dialect.has_table(op.get_bind(), 'tipo_material'):
        op.create_table('tipo_material',
            sa.Column('id_tipoMaterial', mysql.INTEGER(display_width=11), autoincrement=True, nullable=False),
            sa.Column('nombre_tipo_material', mysql.VARCHAR(length=50), nullable=False),
            sa.Column('descripcion_tipoMaterial', mysql.VARCHAR(length=255), nullable=True),
            sa.PrimaryKeyConstraint('id_tipoMaterial'),
            mysql_collate='utf8mb4_general_ci',
            mysql_default_charset='utf8mb4',
            mysql_engine='InnoDB'
        )

    op.drop_table('Interes')
    op.drop_table('Tipo_Material')
