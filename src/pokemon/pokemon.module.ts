import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([ 
      {
        name: Pokemon.name,
        schema: PokemonSchema ,
      }
    ]),
  ],
  exports:[ MongooseModule ]  // Para poder usar el model fuera de esta modulo. en nuestro caso, en el SeedModule
})
export class PokemonModule {}
