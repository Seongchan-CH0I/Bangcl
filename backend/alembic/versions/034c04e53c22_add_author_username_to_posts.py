""""add_author_username_to_posts"

Revision ID: 034c04e53c22
Revises: b02800a3e5e5
Create Date: 2025-07-07 19:45:35.456423

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '034c04e53c22'
down_revision: Union[str, Sequence[str], None] = 'b02800a3e5e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('posts', sa.Column('author_username', sa.String(length=50), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('posts', 'author_username')
    # ### end Alembic commands ###