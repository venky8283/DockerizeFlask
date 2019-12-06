"""empty message

Revision ID: fa4d0dd74ce4
Revises: 
Create Date: 2019-12-05 09:19:21.839853

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fa4d0dd74ce4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('leads',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('full_name', sa.String(length=64), nullable=True),
    sa.Column('email', sa.String(length=200), nullable=True),
    sa.Column('phone_no', sa.BigInteger(), nullable=True),
    sa.Column('product', sa.String(length=100), nullable=True),
    sa.Column('area', sa.Integer(), nullable=True),
    sa.Column('location', sa.String(length=50), nullable=True),
    sa.Column('ref', sa.String(length=50), nullable=True),
    sa.Column('source', sa.String(length=50), nullable=True),
    sa.Column('channel', sa.String(length=50), nullable=True),
    sa.Column('source_type', sa.String(length=200), nullable=True),
    sa.Column('tracker_timestamp', sa.DateTime(), nullable=True),
    sa.Column('first_captured', sa.DateTime(), nullable=True),
    sa.Column('return_count', sa.Integer(), nullable=False),
    sa.Column('deleted', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_leads_email'), 'leads', ['email'], unique=False)
    op.create_index(op.f('ix_leads_first_captured'), 'leads', ['first_captured'], unique=False)
    op.create_index(op.f('ix_leads_full_name'), 'leads', ['full_name'], unique=False)
    op.create_index(op.f('ix_leads_phone_no'), 'leads', ['phone_no'], unique=False)
    op.create_index(op.f('ix_leads_tracker_timestamp'), 'leads', ['tracker_timestamp'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_leads_tracker_timestamp'), table_name='leads')
    op.drop_index(op.f('ix_leads_phone_no'), table_name='leads')
    op.drop_index(op.f('ix_leads_full_name'), table_name='leads')
    op.drop_index(op.f('ix_leads_first_captured'), table_name='leads')
    op.drop_index(op.f('ix_leads_email'), table_name='leads')
    op.drop_table('leads')
    # ### end Alembic commands ###